import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CART_STORAGE_KEY = 'shopping_cart_items';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Inicializar el estado con una función para evitar lecturas innecesarias de localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      console.log('Cargando carrito inicial:', savedCart);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error cargando el carrito:', error);
      return [];
    }
  });

  // Effect para sincronizar el estado con localStorage
  useEffect(() => {
    try {
      console.log('Guardando carrito:', cartItems);
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error guardando el carrito:', error);
    }
  }, [cartItems]);

  // Effect para verificar el estado del carrito cuando el componente se monta
  useEffect(() => {
    console.log('CartProvider montado. Estado inicial del carrito:', cartItems);
    return () => {
      console.log('CartProvider desmontado. Último estado del carrito:', cartItems);
    };
  }, []);

  const addToCart = (product) => {
    console.log('Intentando añadir producto:', product);
    setCartItems(prevItems => {
      const existingProduct = prevItems.find(item => item.id_producto === product.id_producto);
      let newItems;
      
      if (existingProduct) {
        newItems = prevItems.map(item =>
          item.id_producto === product.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        newItems = [...prevItems, { ...product, cantidad: 1 }];
      }

      console.log('Nuevo estado del carrito:', newItems);
      toast.success(`${product.nombre} ha sido agregado al carrito.`, { autoClose: 500 });
      return newItems;
    });
  };

  const increaseQuantity = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id_producto === id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id_producto === id
          ? { ...item, cantidad: item.cantidad > 1 ? item.cantidad - 1 : 1 }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id_producto !== id);
      toast.error('Producto eliminado del carrito.', { autoClose: 500 });
      return newItems;
    });
  };

  const debugCart = () => {
    console.log('Estado actual del carrito:', cartItems);
    console.log('localStorage:', localStorage.getItem(CART_STORAGE_KEY));
  };

  const contextValue = {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    debugCart
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};