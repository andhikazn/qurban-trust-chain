const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/register
router.post(
  '/register',
  body('name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, phone, password, wallet_address } = req.body;
    try {
      const [exists] = await db.query('SELECT id FROM users WHERE email=:email', { email });
      if (exists.length) return res.status(409).json({ error: 'Email sudah terdaftar' });

      const hash = await bcrypt.hash(password, 10);
      const [r] = await db.query(
        `INSERT INTO users (name,email,phone,password_hash,wallet_address)
         VALUES (:name,:email,:phone,:hash,:wallet)`,
        { name, email, phone: phone || null, hash, wallet: wallet_address || null }
      );
      const user = { id: r.insertId, name, email, role: 'peserta' };
      res.status(201).json({ token: signToken(user), user });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

// POST /api/auth/login
router.post('/login', body('email').isEmail(), body('password').notEmpty(), async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email=:email', { email });
    if (!rows.length) return res.status(401).json({ error: 'Email atau password salah' });
    const u = rows[0];
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) return res.status(401).json({ error: 'Email atau password salah' });
    const user = { id: u.id, name: u.name, email: u.email, role: u.role, wallet_address: u.wallet_address };
    res.json({ token: signToken(user), user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/auth/wallet  — update wallet address of logged in user
const { authRequired } = require('../middleware/auth');
router.patch('/wallet', authRequired, async (req, res) => {
  const { wallet_address } = req.body;
  if (!wallet_address) return res.status(400).json({ error: 'wallet_address wajib diisi' });
  try {
    await db.query('UPDATE users SET wallet_address=:w WHERE id=:id', {
      w: wallet_address, id: req.user.id,
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
