const prisma = require('./prisma');
const { sendOrderStatusEmail } = require('./emailService');

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
            data: { status },
            include: {
                user: true
            }
        });

        // Надсилаємо email користувачу
        await sendOrderStatusEmail(
            order.user.email,
            order.id,
            status,
            order.totalPrice
        );

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) }
        });

        if (!order) {
            return res.status(404).json({ message: 'Замовлення не знайдено' });
        }

        if (order.userId !== userId) {
            return res.status(403).json({ message: 'Доступ заборонено' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Можна скасувати тільки замовлення зі статусом «Очікує»' });
        }

        await prisma.orderItem.deleteMany({
            where: { orderId: parseInt(id) }
        });

        await prisma.order.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Замовлення скасовано' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
};

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus, cancelOrder };