const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Тест 1: Хешування паролю
describe('bcrypt', () => {
    test('пароль успішно хешується', async () => {
        const password = 'test123';
        const hash = await bcrypt.hash(password, 10);
        expect(hash).not.toBe(password);
        expect(hash.startsWith('$2b$')).toBe(true);
    });

    test('правильний пароль проходить перевірку', async () => {
        const password = 'test123';
        const hash = await bcrypt.hash(password, 10);
        const isValid = await bcrypt.compare(password, hash);
        expect(isValid).toBe(true);
    });

    test('невірний пароль не проходить перевірку', async () => {
        const password = 'test123';
        const hash = await bcrypt.hash(password, 10);
        const isValid = await bcrypt.compare('wrongpassword', hash);
        expect(isValid).toBe(false);
    });
});

// Тест 2: JWT токен
describe('JWT', () => {
    const secret = 'test_secret';

    test('токен успішно створюється', () => {
        const token = jwt.sign({ userId: 1, role: 'user' }, secret);
        expect(token).toBeTruthy();
    });

    test('токен містить правильні дані', () => {
        const payload = { userId: 1, role: 'admin' };
        const token = jwt.sign(payload, secret);
        const decoded = jwt.verify(token, secret);
        expect(decoded.userId).toBe(1);
        expect(decoded.role).toBe('admin');
    });

    test('невірний токен викидає помилку', () => {
        const token = jwt.sign({ userId: 1 }, secret);
        expect(() => jwt.verify(token, 'wrong_secret')).toThrow();
    });
});