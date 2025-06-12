import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainPage from './pages/MainPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import ContactsPage from './pages/ContactsPage'
import { CartProvider } from './contexts/CartContext';

function App() {
  function toggleMenu() {
    document.getElementById("nav").classList.toggle("active");
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header>
        <div className="logo">VADIK РИБАЛКА</div>
        <div className="burger" onClick={toggleMenu}>☰</div>
        <nav id="nav">
          <a href="/">Головна</a>
          <a href="/cart">Кошик</a>
          <a href="/contacts">Контакти</a>
        </nav>
      </header>

      <CartProvider>
        <BrowserRouter>
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path='/' element={<MainPage />} />
              <Route path='/product/:id' element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
            </Routes>
          </main>
        </BrowserRouter>
      </CartProvider>

      <footer style={{ padding: '1rem', textAlign: 'center' }}>
        © 2025 VADIK РИБАЛКА — Всі права захищені
      </footer>
    </div>
  );
}

export default App
