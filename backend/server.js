const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Маршрути
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const menuRoutes = require('./routes/menu');
app.use('/api/menu', menuRoutes);
const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);
const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Сервер кав\'ярні працює! ☕' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});