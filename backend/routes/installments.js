const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');
const router = express.Router();

// GET /api/installments/participant/:pid
router.get('/participant/:pid', authRequired, async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM payment_installments WHERE participant_id=:pid ORDER BY installment_no ASC',
    { pid: req.params.pid }
  );
  res.json(rows);
});

module.exports = router;
