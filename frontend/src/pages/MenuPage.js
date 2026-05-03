import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';

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

    if (loading) return <p style={{ textAlign: 'center' }}>Завантаження...</p>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Меню ☕</h1>
                <div>
                    <button
                        onClick={() => navigate('/cart')}
                        style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#6F4E37', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px' }}
                    >
                        🛒 Кошик ({totalItems})
                    </button>
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        style={{ padding: '10px 20px', backgroundColor: '#999', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px' }}
                    >
                        Вийти
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {items.map(item => (
                    <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                        )}
                        <h3 style={{ margin: '0 0 5px' }}>{item.name}</h3>
                        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px' }}>{item.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#6F4E37' }}>{item.price} грн</span>
                            <button
                                onClick={() => addToCart(item)}
                                style={{ padding: '8px 15px', backgroundColor: '#6F4E37', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
                            >
                                Додати
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MenuPage;