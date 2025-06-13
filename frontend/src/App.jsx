import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import MainPage from './pages/MainPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import ContactsPage from './pages/ContactsPage'
import { CartProvider } from './contexts/CartContext';

function App() {
  function toggleMenu() {
    document.getElementById("nav").classList.toggle("active");
  }

  function closeMenuIfOpen() {
    const nav = document.getElementById("nav");
    if (nav.classList.contains("active")) {
      nav.classList.remove("active");
    }
  }

  return (
    <CartProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <header>
            <div className="logo">VADIK РИБАЛКА</div>
            <div className="burger" onClick={toggleMenu}>☰</div>
            <nav id="nav">
              <Link to="/" onClick={closeMenuIfOpen}>Головна</Link>
              <Link to="/cart" onClick={closeMenuIfOpen}>Кошик</Link>
              <Link to="/contacts" onClick={closeMenuIfOpen}>Контакти</Link>
            </nav>
          </header>

          <main style={{ flex: 1 }}>
            <Routes>
              <Route path='/' element={<MainPage />} />
              <Route path='/product/:id' element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
            </Routes>
          </main>

          <footer style={{ padding: '1rem', textAlign: 'center' }}>
            © 2025 VADIK РИБАЛКА — Всі права захищені
          </footer>
        </div >
      </BrowserRouter>
    </CartProvider>
  );
}

export default App
