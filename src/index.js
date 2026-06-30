import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

import authRoutes from './routes/auth.routes.js';
import companiesRoutes from './routes/companies.routes.js';
import usersRoutes from './routes/users.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import hrRoutes from './routes/hr.routes.js';
import financeRoutes from './routes/finance.routes.js';
import procurementRoutes from './routes/procurement.routes.js';
import complianceRoutes from './routes/compliance.routes.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Basic brute-force protection on login.
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/auth/login', loginLimiter);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/companies', companiesRoutes);
app.use('/users', usersRoutes);
app.use('/roles', rolesRoutes);
app.use('/hr', hrRoutes);
app.use('/finance', financeRoutes);
app.use('/procurement', procurementRoutes);
app.use('/compliance', complianceRoutes);

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`AegisFlow API listening on port ${port}`);
});
