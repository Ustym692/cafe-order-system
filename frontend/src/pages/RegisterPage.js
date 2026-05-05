import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../App.css';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { email, password });
            navigate('/');
        } catch (err) {
            setError('Помилка реєстрації. Можливо цей email вже існує');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '32px', color: '#6F4E37', marginBottom: '5px' }}>Кав'ярня «Аромат» ☕</h1>
                    <p style={{ color: '#999', fontSize: '14px' }}>Створіть акаунт щоб робити замовлення</p>
                </div>
                <h2>Реєстрація</h2>
                {error && <p className="login-error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-btn">
                        Зареєструватись
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#888' }}>
                    Вже є акаунт?{' '}
                    <span
                        onClick={() => navigate('/')}
                        style={{ color: '#6F4E37', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Увійти
                    </span>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;