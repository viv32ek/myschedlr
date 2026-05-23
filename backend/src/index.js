require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { ensureTable } = require('./db/ensureTables');
const tenantMiddleware = require('./middleware/tenant');
const authRoutes  = require('./routes/auth');
const userRoutes  = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// All routes below require a resolved tenantId
app.use(tenantMiddleware);
app.use('/auth',  authRoutes);
app.use('/users', userRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Not found' }));

const PORT = process.env.PORT || 4000;
if (require.main === module) {
  const tenantId = process.env.TENANT_ID || 'acme';
  ensureTable(tenantId)
    .then(() => app.listen(PORT, () => console.log(`Backend running on port ${PORT}`)))
    .catch((err) => { console.error('Startup error:', err); process.exit(1); });
}

module.exports = app;
