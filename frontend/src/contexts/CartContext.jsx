import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, selectedOption) => {
    setCartItems(prev => {

      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedOption === selectedOption
      );
      if (existingIndex >= 0) {

        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      return [...prev, { product, selectedOption, quantity: 1 }];
    });
  };

  const removeFromCart = (productId, selectedOption) => {
    setCartItems(prev =>
      prev.filter(item => !(item.product.id === productId && item.selectedOption === selectedOption))
    );
  };

  const updateQuantity = (productId, selectedOption, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev => {
      const updated = [...prev];
      const index = updated.findIndex(
        item => item.product.id === productId && item.selectedOption === selectedOption
      );
      if (index >= 0) {
        updated[index].quantity = quantity;
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
