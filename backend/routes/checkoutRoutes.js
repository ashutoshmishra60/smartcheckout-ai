const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

// 1-step detect-to-checkout endpoint
router.post('/detect', checkoutController.detectAndCheckout);

module.exports = router;
