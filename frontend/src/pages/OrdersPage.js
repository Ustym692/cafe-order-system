import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../App.css';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/my');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (orderId) => {
        if (!window.confirm('Скасувати це замовлення?')) return;
        try {
            await api.delete(`/orders/${orderId}`);
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Помилка скасування');
        }
    };

    const statusLabel = (status) => {
        const labels = {
            pending: '⏳ Очікує',
            preparing: '👨‍🍳 Готується',
            ready: '✅ Готово',
            completed: '🎉 Виконано'
        };
        return labels[status] || status;
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '100px' }}>Завантаження...</p>;

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h1>📋 Мої замовлення</h1>
                <button className="btn-logout" onClick={() => navigate('/menu')}>
                    ← Назад до меню
                </button>
            </div>

            {orders.length === 0 ? (
                <p className="cart-empty">Замовлень ще немає 😔</p>
            ) : (
                orders.map(order => (
                    <div key={order.id} className="order-card" style={{ marginBottom: '15px' }}>
                        <div className="order-card-header">
                            <div>
                                <strong>Замовлення #{order.id}</strong>
                                <p style={{ margin: '5px 0', color: '#6F4E37', fontWeight: 'bold' }}>
                                    Сума: {order.totalPrice} грн
                                </p>
                                <p style={{ margin: '5px 0', fontSize: '14px', color: '#888' }}>
                                    {order.items.map(i => `${i.menuItem.name} x${i.quantity}`).join(', ')}
                                </p>
                                <p style={{ margin: '5px 0', fontSize: '13px', color: '#999' }}>
                                    {new Date(order.createdAt).toLocaleString('uk-UA')}
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                <span style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    backgroundColor: '#f5f0eb',
                                    color: '#6F4E37',
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                }}>
                                    {statusLabel(order.status)}
                                </span>
                                {order.status === 'pending' && (
                                    <button
                                        onClick={() => handleCancel(order.id)}
                                        style={{
                                            padding: '6px 14px',
                                            backgroundColor: '#ff4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '13px'
                                        }}
                                    >
                                        Скасувати
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default OrdersPage;