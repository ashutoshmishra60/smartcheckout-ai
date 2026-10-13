/**
 * AI-Powered Automated Retail Checkout System
 * Backend REST API Server (Node.js + Express.js)
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { initDatabase, db } = require('./config/database');
const mlClient = require('./services/mlClient');

const productRoutes = require('./routes/productRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
// Support base64 image payloads up to 50MB from webcam high-res captures
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health and Diagnostics API
app.get('/api/health', async (req, res) => {
  const mlHealth = await mlClient.checkHealth();
  const dbConfig = db.getDbConfig();

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      backend: { status: 'online', port: PORT },
      database: {
        type: db.isFallbackMode() ? 'Standalone Memory Store (MySQL service offline)' : 'MySQL Relational Database',
        host: dbConfig.host,
        database: dbConfig.database,
        status: 'connected'
      },
      mlMicroservice: mlHealth
    }
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/transactions', transactionRoutes);

const path = require('path');
const fs = require('fs');

const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      name: 'AI-Powered Automated Retail Checkout API',
      version: '1.0.0',
      endpoints: {
        health: 'GET /api/health',
        products: 'GET /api/products',
        detect_and_checkout: 'POST /api/checkout/detect',
        create_transaction: 'POST /api/transactions',
        transactions_history: 'GET /api/transactions',
        dashboard_stats: 'GET /api/transactions/stats/dashboard'
      }
    });
  });
}

// Start Server
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  AI Retail Checkout Backend API running on port ${PORT}`);
    console.log(`  API Health: http://localhost:${PORT}/api/health`);
    console.log(`  Detect Endpoint: http://localhost:${PORT}/api/checkout/detect`);
    console.log(`=======================================================`);
  });
}

startServer();
