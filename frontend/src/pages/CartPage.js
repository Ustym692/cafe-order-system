import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';
import '../App.css';

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
            <div className="order-success">
                <h2>✅ Замовлення прийнято!</h2>
                <p>Дякуємо за замовлення. Чекайте на своє замовлення ☕</p>
                <br />
                <button className="btn-cart" onClick={() => navigate('/menu')}>
                    Повернутись до меню
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h1>🛒 Кошик</h1>
                <button className="btn-logout" onClick={() => navigate('/menu')}>
                    ← Назад до меню
                </button>
            </div>

            {cart.length === 0 ? (
                <p className="cart-empty">Кошик порожній 😔</p>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-item-info">
                                <h3>{item.name}</h3>
                                <p className="cart-item-price">{item.price} грн</p>
                            </div>
                            <div className="cart-item-controls">
                                <button className="btn-qty" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button className="btn-qty" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                <button className="btn-remove" onClick={() => removeFromCart(item.id)}>✕</button>
                            </div>
                        </div>
                    ))}

                    <div className="cart-summary">
                        <h2>Разом: {totalPrice} грн</h2>
                        <button className="btn-order" onClick={handleOrder} disabled={loading}>
                            {loading ? 'Оформлення...' : 'Оформити замовлення'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartPage;