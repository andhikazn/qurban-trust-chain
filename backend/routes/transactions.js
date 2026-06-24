const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');
const router = express.Router();

// POST /api/transactions  — catat tx hash dari MetaMask
router.post('/', authRequired, async (req, res) => {
  const {
    participant_id, amount, tx_hash, block_number,
    from_address, to_address, status, network, installment_id,
  } = req.body;
  if (!tx_hash) return res.status(400).json({ error: 'tx_hash wajib diisi' });
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.query(
      `INSERT INTO transactions
       (participant_id,amount,tx_hash,block_number,from_address,to_address,status,network)
       VALUES (:pid,:amount,:hash,:block,:from,:to,:status,:network)`,
      {
        pid: participant_id, amount,
        hash: tx_hash, block: block_number || null,
        from: from_address || null, to: to_address || null,
        status: status || 'confirmed',
        network: network || 'ganache-local',
      }
    );

    // Tandai cicilan lunas jika ada
    if (installment_id) {
      await conn.query(
        `UPDATE payment_installments
         SET status='lunas', paid_at=NOW(), transaction_id=:tid
         WHERE id=:id`,
        { tid: r.insertId, id: installment_id }
      );
    }

    // Update status peserta jika sudah lunas
    const [sum] = await conn.query(
      `SELECT COALESCE(SUM(amount),0) AS paid,
              (SELECT total_amount FROM qurban_participants WHERE id=:pid) AS total
       FROM transactions WHERE participant_id=:pid AND status='confirmed'`,
      { pid: participant_id }
    );
    if (sum[0] && Number(sum[0].paid) >= Number(sum[0].total)) {
      await conn.query(`UPDATE qurban_participants SET status='lunas' WHERE id=:pid`, { pid: participant_id });
    }

    await conn.commit();
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
});

// GET /api/transactions  — ledger publik
router.get('/', async (_req, res) => {
  const [rows] = await db.query(
    `SELECT t.id,t.tx_hash,t.amount,t.block_number,t.from_address,t.to_address,t.status,t.network,t.created_at,
            u.name AS peserta, a.code AS animal_code
     FROM transactions t
     JOIN qurban_participants p ON p.id=t.participant_id
     JOIN users u ON u.id=p.user_id
     JOIN animals a ON a.id=p.animal_id
     ORDER BY t.created_at DESC LIMIT 100`
  );
  res.json(rows);
});

// GET /api/transactions/stats — untuk dashboard
router.get('/stats', async (_req, res) => {
  const [[funds]] = await db.query(
    `SELECT COALESCE(SUM(amount),0) AS total FROM transactions WHERE status='confirmed'`
  );
  const [[parts]] = await db.query(`SELECT COUNT(*) AS c FROM qurban_participants`);
  const [[anim]]  = await db.query(`SELECT COUNT(*) AS c FROM animals`);
  const [[pkg]]   = await db.query(`SELECT COALESCE(SUM(packages),0) AS c FROM distributions`);
  const [[tx]]    = await db.query(`SELECT COUNT(*) AS c FROM transactions`);
  res.json({
    totalDana: Number(funds.total),
    pesertaAktif: parts.c,
    hewanTerdaftar: anim.c,
    paketDistribusi: pkg.c,
    transaksiOnchain: tx.c,
  });
});

module.exports = router;
