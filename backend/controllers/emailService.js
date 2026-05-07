const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const statusLabels = {
    pending: 'Очікує обробки',
    preparing: 'Готується',
    ready: 'Готово до отримання',
    completed: 'Виконано'
};

const sendOrderStatusEmail = async (userEmail, orderId, status, totalPrice) => {
    const statusLabel = statusLabels[status] || status;

    const msg = {
        to: userEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `Кав'ярня «Аромат» — Статус замовлення #${orderId}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6F4E37;">☕ Кав'ярня «Аромат»</h2>
        <p>Вітаємо!</p>
        <p>Статус вашого замовлення <strong>#${orderId}</strong> змінився:</p>
        <div style="background: #f5f0eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="font-size: 18px; color: #6F4E37; margin: 0;"><strong>${statusLabel}</strong></p>
        </div>
        <p>Сума замовлення: <strong>${totalPrice} грн</strong></p>
        <p style="color: #888; font-size: 14px;">Дякуємо що обрали нас! 🙂</p>
      </div>
    `
    };

    try {
        await sgMail.send(msg);
        console.log(`Email надіслано на ${userEmail}`);
    } catch (error) {
        console.error('Помилка надсилання email:', error.message);
    }
};

module.exports = { sendOrderStatusEmail };