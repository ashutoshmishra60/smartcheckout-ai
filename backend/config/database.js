/**
 * AI-Powered Automated Retail Checkout System
 * Database Connection & Adaptor Layer (MySQL with Fallback Store)
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'retail_checkout',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 3000
};

let pool = null;
let useFallback = false;

// Embedded Data Store for instant demonstration if local MySQL service is stopped
const fallbackStore = {
  products: [
    { id: 1, sku: 'SKU-BOT-001', barcode: '890103000001', name: 'Sparkling Mineral Water (500ml)', category: 'Beverages', price: 1.99, cost_price: 0.80, stock_quantity: 148, reorder_level: 20, yolo_class: 'bottle', description: 'Crisp natural spring water with gentle carbonation.', image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80', is_active: 1, created_at: new Date().toISOString() },
    { id: 2, sku: 'SKU-BOT-002', barcode: '890103000002', name: 'Organic Green Tea Bottle (400ml)', category: 'Beverages', price: 2.49, cost_price: 1.10, stock_quantity: 118, reorder_level: 15, yolo_class: 'bottle', description: 'Refreshing unsweetened green tea brewed with Japanese leaves.', image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80', is_active: 1, created_at: new Date().toISOString() },
    { id: 3, sku: 'SKU-APP-001', barcode: '890103000003', name: 'Honeycrisp Fresh Apple', category: 'Produce', price: 0.99, cost_price: 0.40, stock_quantity: 199, reorder_level: 30, yolo_class: 'apple', description: 'Sweet, juicy and crisp hand-picked Honeycrisp apple.', image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&q=80', is_active: 1, created_at: new Date().toISOString() },
    { id: 4, sku: 'SKU-BAN-001', barcode: '890103000004', name: 'Organic Cavendish Banana', category: 'Produce', price: 0.59, cost_price: 0.20, stock_quantity: 248, reorder_level: 40, yolo_class: 'banana', description: 'Ripe yellow organic potassium-rich banana.', image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&q=80', is_active: 1, created_at: new Date().toISOString() },
    { id: 5, sku: 'SKU-ORA-001', barcode: '890103000005', name: 'Valencia Citrus Orange', category: 'Produce', price: 0.89, cost_price: 0.35, stock_quantity: 180, reorder_level: 25, yolo_class: 'orange', description: 'Sun-ripened Valencia orange full of Vitamin C.', image_url: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=300&q=80', is_active: 1, created_at: new Date().toISOString() },
    { id: 6, sku: 'SKU-CUP-001', barcode: '890103000006', name: 'Eco Ceramic Travel Cup (350ml)', category: 'Houseware', price: 6.99, cost_price: 3.00, stock_quantity: 74, reorder_level: 10, yolo_class: 'cup', description: 'Reusable thermal ceramic cup with splash-resistant lid.', image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&q=80', is_active: 1, created_at: new Date().toISOString() },
    { id: 7, sku: 'SKU-SAN-001', barcode: '890103000007', name: 'Artisan Club Sandwich (Turkey & Swiss)', category: 'Deli', price: 5.49, cost_price: 2.50, stock_quantity: 59, reorder_level: 10, yolo_class: 'sandwich', description: 'Freshly baked sourdough sandwich with smoked turkey and aged cheese.', image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&q=80', is_active: 1, created_at: new Date().toISOString() },
    { id: 8, sku: 'SKU-BOK-001', barcode: '890103000008', name: 'Pocket Journal Notebook (Grid 120p)', category: 'Stationery', price: 4.29, cost_price: 1.80, stock_quantity: 90, reorder_level: 15, yolo_class: 'book', description: 'Durable faux-leather pocket notebook with acid-free paper.', image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80', is_active: 1, created_at: new Date().toISOString() },
    { id: 9, sku: 'SKU-DON-001', barcode: '890103000009', name: 'Classic Glazed Ring Donut', category: 'Bakery', price: 1.79, cost_price: 0.60, stock_quantity: 100, reorder_level: 20, yolo_class: 'donut', description: 'Warm fluffy yeast donut drenched in signature vanilla glaze.', image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&q=80', is_active: 1, created_at: new Date().toISOString() },
    { id: 10, sku: 'SKU-CAK-001', barcode: '890103000010', name: 'Belgian Chocolate Cupcake', category: 'Bakery', price: 2.99, cost_price: 1.20, stock_quantity: 80, reorder_level: 15, yolo_class: 'cake', description: 'Rich moist Belgian chocolate cupcake with fudge frosting.', image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80', is_active: 1, created_at: new Date().toISOString() }
  ],
  transactions: [
    { id: 1, transaction_uuid: 'TXN-2026-9001', customer_name: 'Alice Johnson', payment_method: 'CARD', payment_status: 'COMPLETED', subtotal: 6.47, tax_rate: 8.25, tax_amount: 0.53, discount_amount: 0.00, total_amount: 7.00, items_count: 4, detection_confidence_avg: 94.50, notes: null, created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 2, transaction_uuid: 'TXN-2026-9002', customer_name: 'Brian Lee', payment_method: 'UPI', payment_status: 'COMPLETED', subtotal: 12.48, tax_rate: 8.25, tax_amount: 1.03, discount_amount: 1.00, total_amount: 12.51, items_count: 3, detection_confidence_avg: 96.80, notes: null, created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, transaction_uuid: 'TXN-2026-9003', customer_name: 'Chloe Davis', payment_method: 'APPLE_PAY', payment_status: 'COMPLETED', subtotal: 4.47, tax_rate: 8.25, tax_amount: 0.37, discount_amount: 0.00, total_amount: 4.84, items_count: 3, detection_confidence_avg: 91.20, notes: null, created_at: new Date(Date.now() - 1200000).toISOString() }
  ],
  transaction_items: [
    { id: 1, transaction_id: 1, product_id: 1, product_name: 'Sparkling Mineral Water (500ml)', quantity: 2, unit_price: 1.99, subtotal: 3.98, yolo_detected_confidence: 95.00, created_at: new Date().toISOString() },
    { id: 2, transaction_id: 1, product_id: 3, product_name: 'Honeycrisp Fresh Apple', quantity: 1, unit_price: 0.99, subtotal: 0.99, yolo_detected_confidence: 93.00, created_at: new Date().toISOString() },
    { id: 3, transaction_id: 1, product_id: 4, product_name: 'Organic Cavendish Banana', quantity: 2, unit_price: 0.59, subtotal: 1.18, yolo_detected_confidence: 95.50, created_at: new Date().toISOString() },
    { id: 4, transaction_id: 2, product_id: 6, product_name: 'Eco Ceramic Travel Cup (350ml)', quantity: 1, unit_price: 6.99, subtotal: 6.99, yolo_detected_confidence: 98.00, created_at: new Date().toISOString() },
    { id: 5, transaction_id: 2, product_id: 7, product_name: 'Artisan Club Sandwich (Turkey & Swiss)', quantity: 1, unit_price: 5.49, subtotal: 5.49, yolo_detected_confidence: 95.60, created_at: new Date().toISOString() },
    { id: 6, transaction_id: 3, product_id: 1, product_name: 'Sparkling Mineral Water (500ml)', quantity: 1, unit_price: 1.99, subtotal: 1.99, yolo_detected_confidence: 92.40, created_at: new Date().toISOString() },
    { id: 7, transaction_id: 3, product_id: 2, product_name: 'Organic Green Tea Bottle (400ml)', quantity: 1, unit_price: 2.49, subtotal: 2.49, yolo_detected_confidence: 90.00, created_at: new Date().toISOString() }
  ]
};

async function initDatabase() {
  try {
    const testConn = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      connectTimeout: 2000
    });

    console.log(`[DB] Connected to MySQL Server at ${DB_CONFIG.host}:${DB_CONFIG.port}`);
    await testConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\``);
    await testConn.end();

    pool = mysql.createPool(DB_CONFIG);
    useFallback = false;

    // Check if tables exist, otherwise create them
    const [tables] = await pool.query(`SHOW TABLES FROM \`${DB_CONFIG.database}\` LIKE 'products'`);
    if (tables.length === 0) {
      console.log('[DB] Initializing schema and seed data in MySQL...');
      const schemaPath = path.join(__dirname, '../database/schema.sql');
      const seedPath = path.join(__dirname, '../database/seed.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        for (const statement of schemaSql.split(';')) {
          if (statement.trim()) await pool.query(statement);
        }
      }
      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        for (const statement of seedSql.split(';')) {
          if (statement.trim()) await pool.query(statement);
        }
      }
      console.log('[DB] MySQL schema & seeds populated successfully.');
    }
    return true;
  } catch (err) {
    console.warn(`[DB] MySQL not reachable (${err.code || err.message}).`);
    console.log('[DB] Activated Seamless Standalone Storage Mode (Zero external dependencies).');
    useFallback = true;
    return false;
  }
}

// Database helper functions supporting both MySQL and local fallback
const db = {
  async query(sql, params = []) {
    if (!useFallback && pool) {
      try {
        return await pool.query(sql, params);
      } catch (err) {
        console.error('[DB Query Error]', err);
        throw err;
      }
    }

    // Emulated queries for standalone fallback mode
    const lower = sql.toLowerCase().trim();

    // 1. SELECT * FROM products
    if (lower.startsWith('select') && lower.includes('from products')) {
      if (lower.includes('where id =')) {
        const id = params[0];
        const item = fallbackStore.products.find(p => p.id === Number(id));
        return [[item].filter(Boolean)];
      }
      if (lower.includes('where yolo_class =') || lower.includes('where yolo_class in')) {
        if (Array.isArray(params[0])) {
          const items = fallbackStore.products.filter(p => params[0].includes(p.yolo_class));
          return [items];
        } else {
          const cls = params[0];
          const items = fallbackStore.products.filter(p => p.yolo_class === cls);
          return [items];
        }
      }
      return [fallbackStore.products];
    }

    // 2. SELECT * FROM transactions
    if (lower.startsWith('select') && lower.includes('from transactions')) {
      if (lower.includes('where transaction_uuid =') || lower.includes('where id =')) {
        const val = params[0];
        const txn = fallbackStore.transactions.find(t => t.transaction_uuid === val || t.id === Number(val));
        return [[txn].filter(Boolean)];
      }
      // Return sorted descending by date
      const sorted = [...fallbackStore.transactions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return [sorted];
    }

    // 3. SELECT * FROM transaction_items
    if (lower.startsWith('select') && lower.includes('from transaction_items')) {
      if (lower.includes('where transaction_id =')) {
        const txnId = params[0];
        const items = fallbackStore.transaction_items.filter(i => i.transaction_id === Number(txnId));
        return [items];
      }
      return [fallbackStore.transaction_items];
    }

    // 4. INSERT INTO transactions
    if (lower.startsWith('insert into transactions')) {
      const newId = fallbackStore.transactions.length + 1;
      const newTxn = {
        id: newId,
        transaction_uuid: params[0],
        customer_name: params[1] || 'Walk-in Customer',
        payment_method: params[2],
        payment_status: params[3] || 'COMPLETED',
        subtotal: Number(params[4]),
        tax_rate: Number(params[5]),
        tax_amount: Number(params[6]),
        discount_amount: Number(params[7]),
        total_amount: Number(params[8]),
        items_count: Number(params[9]),
        detection_confidence_avg: Number(params[10]) || 95.0,
        notes: params[11] || null,
        created_at: new Date().toISOString()
      };
      fallbackStore.transactions.unshift(newTxn);
      return [{ insertId: newId, affectedRows: 1 }];
    }

    // 5. INSERT INTO transaction_items
    if (lower.startsWith('insert into transaction_items')) {
      const newId = fallbackStore.transaction_items.length + 1;
      const newItem = {
        id: newId,
        transaction_id: Number(params[0]),
        product_id: Number(params[1]),
        product_name: params[2],
        quantity: Number(params[3]),
        unit_price: Number(params[4]),
        subtotal: Number(params[5]),
        yolo_detected_confidence: Number(params[6]) || 95.0,
        created_at: new Date().toISOString()
      };
      fallbackStore.transaction_items.push(newItem);
      return [{ insertId: newId, affectedRows: 1 }];
    }

    // 6. UPDATE products stock_quantity
    if (lower.startsWith('update products') && lower.includes('stock_quantity')) {
      const pId = params[params.length - 1];
      const prod = fallbackStore.products.find(p => p.id === Number(pId));
      if (prod) {
        prod.stock_quantity = Math.max(0, prod.stock_quantity - Number(params[0]));
      }
      return [{ affectedRows: 1 }];
    }

    return [[]];
  },

  isFallbackMode() {
    return useFallback;
  },

  getDbConfig() {
    return DB_CONFIG;
  }
};

module.exports = {
  db,
  initDatabase
};
