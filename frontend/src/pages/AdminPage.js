import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

function AdminPage() {
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [tab, setTab] = useState('menu');
    const [form, setForm] = useState({ name: '', description: '', price: '', category: '', imageUrl: '' });
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMenu();
        fetchOrders();
    }, []);

    const fetchMenu = async () => {
        const res = await api.get('/menu');
        setItems(res.data);
    };

    const fetchOrders = async () => {
        const res = await api.get('/orders/all');
        setOrders(res.data);
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await api.post('/menu', { ...form, price: parseFloat(form.price) });
            setForm({ name: '', description: '', price: '', category: '', imageUrl: '' });
            fetchMenu();
            alert('Страву додано!');
        } catch (err) {
            alert('Помилка при додаванні');
        }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm('Видалити страву?')) return;
        await api.delete(`/menu/${id}`);
        fetchMenu();
    };

    const handleStatusChange = async (orderId, status) => {
        await api.put(`/orders/${orderId}/status`, { status });
        fetchOrders();
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>⚙️ Адмін-панель</h1>
                <button
                    onClick={() => { logout(); navigate('/'); }}
                    style={{ padding: '10px 20px', backgroundColor: '#999', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
                >
                    Вийти
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => setTab('menu')}
                    style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: tab === 'menu' ? '#6F4E37' : '#ddd', color: tab === 'menu' ? 'white' : 'black', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
                >
                    Меню
                </button>
                <button
                    onClick={() => setTab('orders')}
                    style={{ padding: '10px 20px', backgroundColor: tab === 'orders' ? '#6F4E37' : '#ddd', color: tab === 'orders' ? 'white' : 'black', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
                >
                    Замовлення
                </button>
            </div>

            {tab === 'menu' && (
                <div>
                    <h2>Додати страву</h2>
                    <form onSubmit={handleAddItem} style={{ marginBottom: '30px', display: 'grid', gap: '10px' }}>
                        <input placeholder="Назва" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ padding: '10px', fontSize: '16px' }} required />
                        <input placeholder="Опис" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ padding: '10px', fontSize: '16px' }} />
                        <input placeholder="Ціна" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={{ padding: '10px', fontSize: '16px' }} required />
                        <input placeholder="Категорія" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ padding: '10px', fontSize: '16px' }} required />
                        <input placeholder="URL фото" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} style={{ padding: '10px', fontSize: '16px' }} />
                        <button type="submit" style={{ padding: '10px', backgroundColor: '#6F4E37', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px' }}>Додати</button>
                    </form>

                    <h2>Список страв</h2>
                    {items.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', marginBottom: '10px' }}>
                            <div>
                                <strong>{item.name}</strong> — {item.price} грн
                                <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>{item.category}</p>
                            </div>
                            <button onClick={() => handleDeleteItem(item.id)} style={{ padding: '8px 15px', backgroundColor: '#ff4444', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>Видалити</button>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'orders' && (
                <div>
                    <h2>Замовлення</h2>
                    {orders.map(order => (
                        <div key={order.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '10px', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>Замовлення #{order.id}</strong> — {order.user?.email}
                                    <p style={{ margin: '5px 0', color: '#6F4E37' }}>Сума: {order.totalPrice} грн</p>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                                        {order.items.map(i => `${i.menuItem.name} x${i.quantity}`).join(', ')}
                                    </p>
                                </div>
                                <select
                                    value={order.status}
                                    onChange={e => handleStatusChange(order.id, e.target.value)}
                                    style={{ padding: '8px', borderRadius: '5px', fontSize: '14px' }}
                                >
                                    <option value="pending">Очікує</option>
                                    <option value="preparing">Готується</option>
                                    <option value="ready">Готово</option>
                                    <option value="completed">Виконано</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminPage;