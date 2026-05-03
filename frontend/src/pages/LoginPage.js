import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.token, response.data.role);
            if (response.data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/menu');
            }
        } catch (err) {
            setError('Невірний email або пароль');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
            <h2>Вхід ☕</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{ width: '100%', padding: '10px', fontSize: '16px', backgroundColor: '#6F4E37', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
                >
                    Увійти
                </button>
            </form>
        </div>
    );
}

export default LoginPage;