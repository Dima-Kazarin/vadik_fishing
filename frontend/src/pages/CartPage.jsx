import axios from 'axios';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext'

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', address: '', comment: '' });
  const [success, setSuccess] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOrder = async () => {
    try {
      const payload = {
        ...form,
        items: cartItems.map(item => ({
          product: item.product.id,
          option: item.selectedOption,
          quantity: item.quantity,
        })),
      };
      await axios.post('https://kvesy.pythonanywhere.com/api/orders/', payload);
      clearCart();
      setSuccess(true);
      setOrderPlaced(true);
    } catch (e) {
      console.error("Помилка при оформленні замовлення", e);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#333' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>🛒 Кошик</h2>
      {!cartItems.length && !orderPlaced && (
        <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Кошик порожній</p>
      )}

      {cartItems.map((item, index) => {
        const optLabel = item.product.options.find(opt => opt.id === item.selectedOption)?.label;
        return (
          <div
            key={index}
            style={{
              marginBottom: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              padding: '1rem',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <strong style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>{item.product.name}</strong>
            <span style={{ color: '#666', marginBottom: '0.5rem' }}>
              {item.product.price} грн
              {item.product.options.length > 0 && optLabel && (
                <> — <em>{optLabel}</em></>
              )}
            </span>

            <label style={{ marginBottom: '0.5rem' }}>
              Кількість:
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={e =>
                  updateQuantity(item.product.id, item.selectedOption, parseInt(e.target.value) || 1)
                }
                style={{
                  width: '60px',
                  marginLeft: '10px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                }}
              />
            </label>

            <button
              onClick={() => removeFromCart(item.product.id, item.selectedOption)}
              style={{
                alignSelf: 'flex-start',
                padding: '6px 12px',
                backgroundColor: '#ff4d4f',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d9363e'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ff4d4f'}
            >
              Видалити
            </button>
          </div>
        );
      })}

      {cartItems.length > 0 && (
        <>
          <div
            style={{
              fontWeight: 'bold',
              fontSize: '1.3rem',
              marginBottom: '1.5rem',
              textAlign: 'right',
              color: '#222',
            }}
          >
            Загальна вартість: {totalPrice} грн
          </div>

          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.3rem' }}>
            Ваші дані
          </h3>
          <input
            name="name"
            placeholder="Ім’я"
            value={form.name}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              marginBottom: '0.8rem',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
          <input
            name="phone"
            placeholder="Телефон"
            value={form.phone}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              marginBottom: '0.8rem',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
          <input
            name="address"
            placeholder="Адреса"
            value={form.address}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              marginBottom: '0.8rem',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
          <textarea
            name="comment"
            placeholder="Коментар"
            value={form.comment}
            onChange={handleChange}
            rows={4}
            style={{
              width: '100%',
              padding: '8px 12px',
              marginBottom: '1rem',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              resize: 'vertical',
            }}
          />

          <button
            onClick={handleOrder}
            disabled={!form.name || !form.phone}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: (!form.name || !form.phone || !form.address) ? '#ccc' : '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: (!form.name || !form.phone || !form.address) ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={e => {
              if (form.name && form.phone) e.currentTarget.style.backgroundColor = '#218838';
            }}
            onMouseLeave={e => {
              if (form.name && form.phone) e.currentTarget.style.backgroundColor = '#28a745';
            }}
          >
            🧾 Оформити замовлення
          </button>
        </>
      )}

      {success && (
        <p
          style={{
            color: 'green',
            marginTop: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '1.1rem',
          }}
        >
          ✅ Замовлення успішно оформлено!
        </p>
      )}
    </div>
  );
};

export default CartPage;
