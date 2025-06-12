import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/product/${id}/`)
      .then(res => {
        setProduct(res.data);
        setSelectedOption(res.data.options[0]?.id || null);
      })
      .catch(err => console.error('Помилка при завантаженні товару', err));
  }, [id]);

  if (!product) return <p>Завантаження...</p>;

  const images = product.images || [];

  const handlePrev = () => {
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleAddToCart = () => {
    if (product.options.length === 0 || selectedOption !== null) {
      addToCart(product, selectedOption);
      navigate('/');
    } else {
      alert("Оберіть опцію!");
    }
  };

  return (
    <div className="catalog" style={{ paddingTop: '2rem' }}>
      <div className="product" style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
        {images.length > 0 && (
          <div style={{ position: 'relative' }}>
            <img
              src={`http://127.0.0.1:8000${images[currentImageIndex].image}`}
              alt={product.name}
              style={{ width: '100%', borderRadius: '16px', objectFit: 'contain' }}
            />
            <button onClick={handlePrev} style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)' }}>◀️</button>
            <button onClick={handleNext} style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}>▶️</button>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
              {images.map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleDotClick(index)}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: index === currentImageIndex ? '#000' : '#ccc',
                    margin: '0 5px',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <h2>{product.name}</h2>
        <p style={{ whiteSpace: 'pre-line' }}>{product.description}</p>
        <p><strong>Ціна:</strong> {product.price} грн</p>

        {product.options.length > 0 && (
  <div style={{ marginTop: '1rem' }}>
    <label><strong>Оберіть вагу:</strong></label>
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
      {product.options.map(opt => {
        console.log(opt.is_available)
        const isAvailable = opt.is_available !== false; // считаем отсутствующими, если available === false
        return (
          <button
            key={opt.id}
            onClick={() => isAvailable && setSelectedOption(opt.id)}
            disabled={!isAvailable}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: selectedOption === opt.id ? '2px solid #f1c40f' : '1px solid #ccc',
              backgroundColor: selectedOption === opt.id
                ? '#fff8dc'
                : !isAvailable
                  ? '#f8d7da' // светло-красный для отсутствующих
                  : '#f9f9f9',
              cursor: isAvailable ? 'pointer' : 'not-allowed',
              fontWeight: selectedOption === opt.id ? 'bold' : 'normal',
              boxShadow: selectedOption === opt.id ? '0 0 5px rgba(0,0,0,0.2)' : 'none',
              color: !isAvailable ? '#721c24' : 'inherit', // темно-красный текст для отсутствующих
            }}
            title={!isAvailable ? 'Ця вага тимчасово відсутня' : ''}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
)}

        <button onClick={handleAddToCart} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Додати в кошик
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
