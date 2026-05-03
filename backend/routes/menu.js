const express = require('express');
const router = express.Router();
const { getAllItems, getItemById, createItem, updateItem, deleteItem } = require('../controllers/menuController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/', getAllItems);
router.get('/:id', getItemById);
router.post('/', authenticate, isAdmin, createItem);
router.put('/:id', authenticate, isAdmin, updateItem);
router.delete('/:id', authenticate, isAdmin, deleteItem);

module.exports = router;