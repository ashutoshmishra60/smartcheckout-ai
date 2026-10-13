const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/class/:yoloClass', productController.getProductsByYoloClass);
router.patch('/:id/stock', productController.updateStock);

module.exports = router;
