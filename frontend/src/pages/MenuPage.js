import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import '../App.css';

function MenuPage() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const { addToCart, totalItems } = useCart();
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMenu();
    }, [activeCategory]);

    const fetchMenu = async () => {
        try {
            setLoading(true);
            const params = activeCategory ? { category: activeCategory } : {};
            const response = await api.get('/menu', { params });
            setItems(response.data);

            // Отримуємо всі категорії тільки при першому завантаженні
            if (!activeCategory) {
                const allResponse = await api.get('/menu');
                const uniqueCategories = [...new Set(allResponse.data.map(item => item.category))];
                setCategories(uniqueCategories);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '100px' }}>Завантаження...</p>;

    return (
        <div className="menu-container">
            <div className="menu-header">
                <h1>Меню ☕</h1>
                <div className="menu-header-buttons">
                    <button className="btn-cart" onClick={() => navigate('/cart')}>
                        🛒 Кошик ({totalItems})
                    </button>
                    <button className="btn-logout" onClick={() => navigate('/orders')}>
                        📋 Замовлення
                    </button>
                    <button className="btn-logout" onClick={() => { logout(); navigate('/'); }}>
                        Вийти
                    </button>
                </div>
            </div>

            {/* Фільтри категорій */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setActiveCategory('')}
                    style={{
                        padding: '8px 18px',
                        borderRadius: '20px',
                        border: '2px solid #6F4E37',
                        backgroundColor: activeCategory === '' ? '#6F4E37' : 'white',
                        color: activeCategory === '' ? 'white' : '#6F4E37',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}
                >
                    Всі
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{
                            padding: '8px 18px',
                            borderRadius: '20px',
                            border: '2px solid #6F4E37',
                            backgroundColor: activeCategory === cat ? '#6F4E37' : 'white',
                            color: activeCategory === cat ? 'white' : '#6F4E37',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="menu-grid">
                {items.map(item => (
                    <div key={item.id} className="menu-card">
                        {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.name} />
                        )}
                        <div className="menu-card-body">
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <div className="menu-card-footer">
                                <span className="menu-price">{item.price} грн</span>
                                <button className="btn-add" onClick={() => addToCart(item)}>
                                    Додати
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MenuPage;