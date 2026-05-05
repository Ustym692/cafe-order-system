const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../controllers/uploadController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.post('/', authenticate, isAdmin, upload.single('image'), uploadImage);

module.exports = router;