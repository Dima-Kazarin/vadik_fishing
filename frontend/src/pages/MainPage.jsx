import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const MainPage = () => {
    const [products, setProducts] = useState([])

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/product/')
      .then(response => {
        console.log('Продукты:', response.data[0].images[0].image);
        setProducts(response.data)
      })
      .catch(error => {
        console.error('Ошибка при загрузке продуктов:', error);
      });
  }, []);

  return (
    <>
      <div className="hero">
        <h1>Найкращі снасті для риболовлі</h1>
        <p>Обладнання, яке ви полюбите. Успішна рибалка починається тут.</p>
      </div>

      <div id="catalog" className="catalog">
        {products.map(product => (
          <Link to={`/product/${product.id}`} className='product' key={product.id}>
            <img src={`http://127.0.0.1:8000${product.images[0].image}`} alt={product.name}/>
            <h2>{product.name}</h2>
            <p>Цена: {product.price} грн</p>
            {product.is_available ? (
              <div className="status in-stock">В наявності</div>
            ) : (
              <div className="status out-of-stock">Закінчилось</div>
            )}
          </Link>
        ))}
      </div>
    </>
  )
}

export default MainPage