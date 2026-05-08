const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.post('/', authenticate, createOrder);
router.get('/my', authenticate, getUserOrders);
router.get('/all', authenticate, isAdmin, getAllOrders);
router.put('/:id/status', authenticate, isAdmin, updateOrderStatus);
router.delete('/:id', authenticate, cancelOrder);

module.exports = router;