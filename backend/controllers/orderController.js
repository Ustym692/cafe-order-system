const prisma = require('./prisma');

const createOrder = async (req, res) => {
    try {
        const { items } = req.body;
        const userId = req.user.userId;

        // Обчислення суми
        let totalPrice = 0;
        const orderItems = [];

        for (const item of items) {
            const menuItem = await prisma.menuItem.findUnique({
                where: { id: item.menuItemId }
            });

            if (!menuItem) {
                return res.status(404).json({ message: `Страву з id ${item.menuItemId} не знайдено` });
            }

            totalPrice += menuItem.price * item.quantity;
            orderItems.push({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                price: menuItem.price
            });
        }

        // Створюємо замовлення
        const order = await prisma.order.create({
            data: {
                userId,
                totalPrice,
                items: {
                    create: orderItems
                }
            },
            include: {
                items: {
                    include: {
                        menuItem: true
                    }
                }
            }
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
};

// Отримати замовлення користувача
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.userId;

        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        menuItem: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
};

// Отримати всі замовлення (адмін)
const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: { select: { email: true } },
                items: {
                    include: {
                        menuItem: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
};

// Оновити статус замовлення (адмін)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
};

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus };