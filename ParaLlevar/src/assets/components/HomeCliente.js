import React, { useState, useEffect } from "react";
import pizza from '../images/pizza.png';
import axios from 'axios';
import MapComponent from './MapComponent'; 
import '../styles/cliente.css';
import ProductosCards from "./ProductoCards";
import Header from './Header';
import Cart from './Cart';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function HomeCliente() {
  const [productos, setProductos] = useState([]); 
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/productos');
        console.log(response.data);
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener los productos: ', error);
      }
    };    
    obtenerProductos();
  }, []);

  const handleAddToCart = (producto) => {
    setCartItems(prevCartItems => {
      const existingProduct = prevCartItems.find(item => item.id === producto.id);
      
      if (existingProduct) {
        return prevCartItems.map(item => 
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item,
          toast.success(`${producto.nombre_producto} se ha agregado al carrito`)
        );
      } else {
        toast.success(`${producto.nombre_producto} se ha agregado al carrito`);
        return [...prevCartItems, { ...producto, cantidad: 1 }];
      }
    });
  };
  

  const handleIncreaseQuantity = (id) => {
    setCartItems(prevCartItems => prevCartItems.map(item => item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item));
  };

  const handleDecreaseQuantity = (id) => {
    setCartItems(prevCartItems => prevCartItems.map(item => item.id === id ? { ...item, cantidad: item.cantidad > 1 ? item.cantidad - 1 : 1 } : item));
  };

  const handleRemoveItem = (id) => {
    setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== id));
    toast.success("Producto eliminado del carrito");
  };



  return (
    <div className='ClienteContainer'>
      <Header cartCount={cartItems.length} onCartClick={() => setShowCart(!showCart)} />
      <div className='textoImagen'>
        <h1 className='texto1'>Disfruta </h1>
        <h1 className='texto2'>la mejor comida está aquí</h1>
        <p className='subtexto'>Revisa todas las ofertas. ¡Seguro te encantarán!</p>
      </div>
      <div className="imagenPizza">
        <img src={pizza} alt="Pizza" className="imagen2" />
      </div>
      <div className="waves-background2"></div>
      <div className="contenedorRojo"></div>
      <div className="contenedorBlanco">
        <h1>OFERTAS</h1>
        <div className="linea"></div>
        <ProductosCards 
          productos={productos} 
          nombreBoton={'AÑADIR AL CARRITO'} 
          carruselId={`carrusel-productos-ofertas`}
          onBuyClick={handleAddToCart}
        />
        
        <h1>MENÚ</h1>
        <ProductosCards 
          productos={productos} 
          nombreBoton={'AÑADIR AL CARRITO'} 
          carruselId={`carrusel-productos`}
          onBuyClick={handleAddToCart}
        />
        
        <h1>NUESTRA UBICACIÓN</h1>
        <MapComponent/>
      </div>
      <div className="contenedorFooter">
        <div className="textoFooter2">
          Copyright © 2024 Para Llevar. All Rights Reserved.
        </div>
      </div>
      {showCart && (
        <Cart
          cartItems={cartItems}
          onIncreaseQuantity={handleIncreaseQuantity}
          onDecreaseQuantity={handleDecreaseQuantity}
          onRemoveItem={handleRemoveItem}
          onClose={() => setShowCart(false)}
        />
      )}
      <ToastContainer 
        position="top-right" 
        autoClose={2000} 
        hideProgressBar={false} 
        closeButton={false}  
        style={{ width: '400px', top:'5rem'}}
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default HomeCliente;
