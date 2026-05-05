import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import '../App.css';

function AdminPage() {
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [tab, setTab] = useState('menu');
    const [form, setForm] = useState({ name: '', description: '', price: '', category: '', imageUrl: '' });
    const [editItem, setEditItem] = useState(null);
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

    const handleEditClick = (item) => {
        setEditItem(item);
    };

    const handleUpdateItem = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/menu/${editItem.id}`, {
                name: editItem.name,
                description: editItem.description,
                price: parseFloat(editItem.price),
                category: editItem.category,
                imageUrl: editItem.imageUrl,
                available: editItem.available
            });
            setEditItem(null);
            fetchMenu();
            alert('Страву оновлено!');
        } catch (err) {
            alert('Помилка при оновленні');
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
        <div className="admin-container">
            <div className="admin-header">
                <h1>⚙️ Адмін-панель</h1>
                <button className="btn-logout" onClick={() => { logout(); navigate('/'); }}>
                    Вийти
                </button>
            </div>

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${tab === 'menu' ? 'active' : 'inactive'}`}
                    onClick={() => setTab('menu')}
                >
                    Меню
                </button>
                <button
                    className={`tab-btn ${tab === 'orders' ? 'active' : 'inactive'}`}
                    onClick={() => setTab('orders')}
                >
                    Замовлення
                </button>
            </div>

            {tab === 'menu' && (
                <div>
                    {editItem && (
                        <div className="admin-form" style={{ marginBottom: '30px', border: '2px solid #6F4E37' }}>
                            <h2 style={{ color: '#6F4E37' }}>Редагувати страву</h2>
                            <form onSubmit={handleUpdateItem}>
                                <input placeholder="Назва" value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })} required />
                                <input placeholder="Опис" value={editItem.description || ''} onChange={e => setEditItem({ ...editItem, description: e.target.value })} />
                                <input placeholder="Ціна" type="number" value={editItem.price} onChange={e => setEditItem({ ...editItem, price: e.target.value })} required />
                                <input placeholder="Категорія" value={editItem.category} onChange={e => setEditItem({ ...editItem, category: e.target.value })} required />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" className="btn-submit">Зберегти</button>
                                    <button type="button" className="btn-delete" onClick={() => setEditItem(null)}>Скасувати</button>
                                </div>
                            </form>
                        </div>
                    )}
                    <h2 style={{ marginBottom: '15px', color: '#6F4E37' }}>Додати страву</h2>
                    <form onSubmit={handleAddItem} className="admin-form">
                        <input placeholder="Назва" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        <input placeholder="Опис" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                        <input placeholder="Ціна" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                        <input placeholder="Категорія" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                const formData = new FormData();
                                formData.append('image', file);
                                try {
                                    const res = await api.post('/upload', formData, {
                                        headers: { 'Content-Type': 'multipart/form-data' }
                                    });
                                    setForm({ ...form, imageUrl: res.data.url });
                                    alert('Фото завантажено!');
                                } catch (err) {
                                    alert('Помилка завантаження фото');
                                }
                            }}
                        />
                        <button type="submit" className="btn-submit">Додати</button>
                    </form>

                    <h2 style={{ marginBottom: '15px', color: '#6F4E37' }}>Список страв</h2>
                    {items.map(item => (
                        <div key={item.id} className="admin-item">
                            <div>
                                <strong>{item.name}</strong> — {item.price} грн
                                <p style={{ margin: '4px 0 0', color: '#888', fontSize: '14px' }}>{item.category}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn-submit" onClick={() => handleEditClick(item)}>Редагувати</button>
                                <button className="btn-delete" onClick={() => handleDeleteItem(item.id)}>Видалити</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'orders' && (
                <div>
                    <h2 style={{ marginBottom: '15px', color: '#6F4E37' }}>Замовлення</h2>
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-card-header">
                                <div>
                                    <strong>Замовлення #{order.id}</strong> — {order.user?.email}
                                    <p style={{ margin: '5px 0', color: '#6F4E37', fontWeight: 'bold' }}>Сума: {order.totalPrice} грн</p>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
                                        {order.items.map(i => `${i.menuItem.name} x${i.quantity}`).join(', ')}
                                    </p>
                                </div>
                                <select
                                    value={order.status}
                                    onChange={e => handleStatusChange(order.id, e.target.value)}
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