require('dotenv').config();
const express = require('express');
const cors = require('cors');

const tenantMiddleware = require('./middleware/tenant');
const userRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// All routes below require a resolved tenantId
app.use(tenantMiddleware);
app.use('/users', userRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Not found' }));

const PORT = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}

module.exports = app;
