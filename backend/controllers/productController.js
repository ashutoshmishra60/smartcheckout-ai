/**
 * AI-Powered Automated Retail Checkout System
 * Product Controller - MySQL Product Catalog Management
 */

const { db } = require('../config/database');

const productController = {
  /**
   * Get all products in the catalog
   */
  async getAllProducts(req, res) {
    try {
      const [products] = await db.query('SELECT * FROM products ORDER BY category, name');
      return res.json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Get single product by ID
   */
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
      if (!rows || rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      return res.json({ success: true, data: rows[0] });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Get products by YOLO classification class
   */
  async getProductsByYoloClass(req, res) {
    try {
      const { yoloClass } = req.params;
      const [rows] = await db.query('SELECT * FROM products WHERE yolo_class = ?', [yoloClass]);
      return res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  /**
   * Update stock levels (inventory reorder / adjustment)
   */
  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { adjustment, newQuantity } = req.body;

      if (newQuantity !== undefined) {
        await db.query('UPDATE products SET stock_quantity = ? WHERE id = ?', [newQuantity, id]);
      } else if (adjustment !== undefined) {
        await db.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?', [adjustment, id]);
      } else {
        return res.status(400).json({ success: false, error: 'Provide newQuantity or adjustment' });
      }

      const [updated] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
      return res.json({ success: true, data: updated[0] });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};

module.exports = productController;
