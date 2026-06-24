const express = require('express');
const db = require('../db');
const { authRequired, roleRequired } = require('../middleware/auth');
const router = express.Router();

// GET /api/animals
router.get('/', async (_req, res) => {
  const [rows] = await db.query('SELECT * FROM animals ORDER BY id ASC');
  res.json(rows);
});

// GET /api/animals/:id
router.get('/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM animals WHERE id=:id', { id: req.params.id });
  if (!rows.length) return res.status(404).json({ error: 'Tidak ditemukan' });
  res.json(rows[0]);
});

// POST /api/animals  (panitia/admin)
router.post('/', authRequired, roleRequired('panitia', 'admin'), async (req, res) => {
  const { code, name, type, weight_kg, price, peternak, max_slots, image_url } = req.body;
  try {
    const [r] = await db.query(
      `INSERT INTO animals (code,name,type,weight_kg,price,peternak,max_slots,image_url)
       VALUES (:code,:name,:type,:weight_kg,:price,:peternak,:max_slots,:image_url)`,
      { code, name, type, weight_kg, price, peternak, max_slots: max_slots || 1, image_url }
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
