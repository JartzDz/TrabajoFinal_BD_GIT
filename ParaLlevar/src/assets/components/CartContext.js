import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Importar toast
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de toast

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (storedCartItems) {
      setCartItems(storedCartItems);
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find(item => item.id_producto === product.id_producto);
      if (existingProduct) {
        const updatedItems = prevItems.map(item =>
          item.id_producto === product.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
        toast.success(`${product.nombre} ha sido agregado al carrito.`);
        return updatedItems;
      } else {
        const newItems = [...prevItems, { ...product, cantidad: 1 }];
        toast.success(`${product.nombre} ha sido agregado al carrito.`); 
        return newItems;
      }
    });
  };

  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id_producto === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id_producto === id
          ? { ...item, cantidad: item.cantidad > 1 ? item.cantidad - 1 : 1 }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter(item => item.id_producto !== id);
      toast.error('Producto eliminado del carrito.'); // Toast de error al eliminar
      return newItems;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
