const express = require('express');
const db = require('../db');
const { authRequired, roleRequired } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (_req, res) => {
  const [rows] = await db.query(
    `SELECT d.*, a.code AS animal_code, a.name AS animal_name
     FROM distributions d JOIN animals a ON a.id=d.animal_id
     ORDER BY d.scheduled_at DESC`
  );
  res.json(rows);
});

router.post('/', authRequired, roleRequired('panitia', 'admin'), async (req, res) => {
  const { animal_id, area, recipients, packages, status, scheduled_at, tx_hash, notes } = req.body;
  try {
    const [r] = await db.query(
      `INSERT INTO distributions (animal_id,area,recipients,packages,status,scheduled_at,tx_hash,notes)
       VALUES (:animal_id,:area,:recipients,:packages,:status,:scheduled_at,:tx_hash,:notes)`,
      {
        animal_id, area,
        recipients: recipients || 0, packages: packages || 0,
        status: status || 'terjadwal',
        scheduled_at: scheduled_at || null,
        tx_hash: tx_hash || null, notes: notes || null,
      }
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/:id', authRequired, roleRequired('panitia', 'admin'), async (req, res) => {
  const { status, completed_at, recipients, packages, tx_hash } = req.body;
  await db.query(
    `UPDATE distributions
     SET status=COALESCE(:status,status),
         completed_at=COALESCE(:completed_at,completed_at),
         recipients=COALESCE(:recipients,recipients),
         packages=COALESCE(:packages,packages),
         tx_hash=COALESCE(:tx_hash,tx_hash)
     WHERE id=:id`,
    { status, completed_at, recipients, packages, tx_hash, id: req.params.id }
  );
  res.json({ ok: true });
});

module.exports = router;
