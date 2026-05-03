const prisma = require('./prisma');

// Отримати всі позиції меню
const getAllItems = async (req, res) => {
    try {
        const items = await prisma.menuItem.findMany({
            where: { available: true }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
};

// Отримати одну позицію
const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.menuItem.findUnique({
            where: { id: parseInt(id) }
        });
        if (!item) return res.status(404).json({ message: 'Позицію не знайдено' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
};

// Створити позицію (тільки адмін)
const createItem = async (req, res) => {
    try {
        const { name, description, price, imageUrl, category } = req.body;
        const item = await prisma.menuItem.create({
            data: { name, description, price: parseFloat(price), imageUrl, category }
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
};

// Оновити позицію (тільки адмін)
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, imageUrl, category, available } = req.body;
        const item = await prisma.menuItem.update({
            where: { id: parseInt(id) },
            data: { name, description, price: parseFloat(price), imageUrl, category, available }
        });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
};

// Видалити позицію (тільки адмін)
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.menuItem.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Позицію видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
};

module.exports = { getAllItems, getItemById, createItem, updateItem, deleteItem };