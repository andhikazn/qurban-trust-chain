const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');
const router = express.Router();

// POST /api/participants  — daftar qurban
router.post('/', authRequired, async (req, res) => {
  const { animal_id, service_type, total_amount, payment_method, onchain_id } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [animals] = await conn.query(
      'SELECT * FROM animals WHERE id=:id FOR UPDATE',
      { id: animal_id }
    );
    if (!animals.length) throw new Error('Hewan tidak ditemukan');
    const a = animals[0];
    if (a.taken_slots >= a.max_slots) throw new Error('Slot sudah penuh');

    const slot_number = a.taken_slots + 1;

    const [r] = await conn.query(
      `INSERT INTO qurban_participants
       (user_id,animal_id,service_type,slot_number,total_amount,payment_method,status,onchain_id)
       VALUES (:user_id,:animal_id,:service_type,:slot_number,:total_amount,:payment_method,'aktif',:onchain_id)`,
      {
        user_id: req.user.id,
        animal_id,
        service_type,
        slot_number,
        total_amount,
        payment_method: payment_method || 'lunas',
        onchain_id: onchain_id || null,
      }
    );

    const newTaken = a.taken_slots + 1;
    await conn.query(
      `UPDATE animals SET taken_slots=:t, status=IF(:t>=max_slots,'penuh','tersedia') WHERE id=:id`,
      { t: newTaken, id: animal_id }
    );

    // Auto-generate cicilan rows if installment
    if (payment_method === 'cicilan') {
      const months = 6;
      const each = Number(total_amount) / months;
      const today = new Date();
      for (let i = 1; i <= months; i++) {
        const due = new Date(today.getFullYear(), today.getMonth() + i, today.getDate());
        await conn.query(
          `INSERT INTO payment_installments (participant_id,installment_no,amount,due_date)
           VALUES (:pid,:n,:amount,:due)`,
          { pid: r.insertId, n: i, amount: each.toFixed(2), due: due.toISOString().slice(0, 10) }
        );
      }
    }

    await conn.commit();
    res.status(201).json({ id: r.insertId, slot_number });
  } catch (e) {
    await conn.rollback();
    res.status(400).json({ error: e.message });
  } finally {
    conn.release();
  }
});

// GET /api/participants/me
router.get('/me', authRequired, async (req, res) => {
  const [rows] = await db.query(
    `SELECT p.*, a.name AS animal_name, a.code AS animal_code, a.type AS animal_type
     FROM qurban_participants p JOIN animals a ON a.id=p.animal_id
     WHERE p.user_id=:uid ORDER BY p.registered_at DESC`,
    { uid: req.user.id }
  );
  res.json(rows);
});

// GET /api/participants  (panitia)
router.get('/', authRequired, async (_req, res) => {
  const [rows] = await db.query(
    `SELECT p.*, u.name AS user_name, u.email, a.code AS animal_code, a.name AS animal_name
     FROM qurban_participants p
     JOIN users u ON u.id=p.user_id
     JOIN animals a ON a.id=p.animal_id
     ORDER BY p.registered_at DESC`
  );
  res.json(rows);
});

module.exports = router;
