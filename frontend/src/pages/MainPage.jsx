import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const MainPage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    axios.get('https://kvesy.pythonanywhere.com/api/category/')
      .then(response => {
        setCategories(response.data)
        console.log(response.data)
      })
      .catch(error => {
        console.error('Ошибка при загрузке категорий:', error);
      });
  }, [])

  useEffect(() => {
    const url = selectedCategory
      ? `https://kvesy.pythonanywhere.com/api/product/?category=${selectedCategory}`
      : 'https://kvesy.pythonanywhere.com/api/product/'

    console.log(url)

    axios.get(url)
      .then(response => {
        setProducts(response.data)
      })
      .catch(error => {
        console.error('Ошибка при загрузке продуктов:', error);
      });
  }, [selectedCategory])

  return (
    <>
      <div className="hero">
        <h1>Найкращі снасті для риболовлі</h1>
        <p>Обладнання, яке ви полюбите. Успішна рибалка починається тут.</p>
      </div>

      <div className="category-buttons">
        <button
          onClick={() => setSelectedCategory(null)}
          className={selectedCategory === null ? 'active' : ''}
        >
          Усі категорії
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={selectedCategory === cat.id ? 'active' : ''}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div id="catalog" className="catalog">
        {products.map(product => (
          <Link to={`/product/${product.id}`} className='product' key={product.id}>
            <img src={`https://kvesy.pythonanywhere.com${product.images[0]?.image}`} alt={product.name} />
            <h2>{product.name}</h2>
            <p>Ціна: {product.price} грн</p>
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
