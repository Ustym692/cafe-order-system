import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';

function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
    const [ordered, setOrdered] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOrder = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            const items = cart.map(item => ({
                menuItemId: item.id,
                quantity: item.quantity
            }));
            await api.post('/orders', { items });
            clearCart();
            setOrdered(true);
        } catch (err) {
            alert('Помилка при створенні замовлення');
        } finally {
            setLoading(false);
        }
    };

    if (ordered) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2>✅ Замовлення прийнято!</h2>
                <p>Дякуємо за замовлення. Чекайте на своє замовлення ☕</p>
                <button
                    onClick={() => navigate('/menu')}
                    style={{ padding: '10px 20px', backgroundColor: '#6F4E37', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '16px' }}
                >
                    Повернутись до меню
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>🛒 Кошик</h1>
                <button
                    onClick={() => navigate('/menu')}
                    style={{ padding: '10px 20px', backgroundColor: '#999', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
                >
                    ← Назад до меню
                </button>
            </div>

            {cart.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>Кошик порожній</p>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', marginBottom: '10px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 5px' }}>{item.name}</h3>
                                <p style={{ margin: 0, color: '#6F4E37' }}>{item.price} грн</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '5px 10px', fontSize: '16px', cursor: 'pointer' }}>-</button>
                                <span style={{ fontSize: '18px' }}>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '5px 10px', fontSize: '16px', cursor: 'pointer' }}>+</button>
                                <button onClick={() => removeFromCart(item.id)} style={{ padding: '5px 10px', backgroundColor: '#ff4444', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>✕</button>
                            </div>
                        </div>
                    ))}

                    <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                        <h2 style={{ margin: '0 0 15px' }}>Разом: {totalPrice} грн</h2>
                        <button
                            onClick={handleOrder}
                            disabled={loading}
                            style={{ width: '100%', padding: '15px', backgroundColor: '#6F4E37', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '18px' }}
                        >
                            {loading ? 'Оформлення...' : 'Оформити замовлення'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartPage;