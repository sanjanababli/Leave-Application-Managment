const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',   require('./routes/authRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));

// ── Health Check ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🚀 Leave Management API is running!' });
});

// ── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});