import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import '../App.css';

function MenuPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, totalItems } = useCart();
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await api.get('/menu');
                setItems(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

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