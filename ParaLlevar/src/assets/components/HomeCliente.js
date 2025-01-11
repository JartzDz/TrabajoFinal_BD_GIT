import React, { useContext, useState, useEffect } from "react";
import pizza from '../images/pizza.png';
import axios from 'axios';
import MapComponent from './MapComponent';
import '../styles/cliente.css';
import ProductosCards from "./ProductoCards";
import Header from './Header';
import Cart from './Cart';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartContext } from './CartContext'; // Importar el contexto

function HomeCliente() {
  const { cartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext); // Usar el contexto
  const [productos, setProductos] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/productos');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener los productos: ', error);
      }
    };
    obtenerProductos();
  }, []);

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
          onBuyClick={addToCart} // Usar el método del contexto
        />
        
        <h1>MENÚ</h1>
        <ProductosCards 
          productos={productos} 
          nombreBoton={'AÑADIR AL CARRITO'} 
          carruselId={`carrusel-productos`}
          onBuyClick={addToCart} // Usar el método del contexto
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
          onIncreaseQuantity={increaseQuantity}
          onDecreaseQuantity={decreaseQuantity}
          onRemoveItem={removeFromCart}
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
