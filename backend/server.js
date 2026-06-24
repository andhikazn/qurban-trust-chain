require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'qurbanchain-backend' }));

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/animals',       require('./routes/animals'));
app.use('/api/participants',  require('./routes/participants'));
app.use('/api/transactions',  require('./routes/transactions'));
app.use('/api/distributions', require('./routes/distributions'));
app.use('/api/installments',  require('./routes/installments'));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ QurbanChain API ready on http://localhost:${PORT}`));
