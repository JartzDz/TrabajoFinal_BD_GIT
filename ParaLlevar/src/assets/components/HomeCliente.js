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
import { CartContext } from './CartContext';

function HomeCliente() {
  const { cartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);
  const [productosSinOfertas, setProductosSinOfertas] = useState([]);
  const [productosConOfertas, setProductosConOfertas] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const obtenerProductosConOfertas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ofertas');
        setProductosConOfertas(response.data);
      } catch (error) {
        console.error('Error al obtener productos con ofertas: ', error);
        toast.error('No se pudo cargar las ofertas.');
      }
    };
  
    const obtenerProductosSinOfertas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/productos/');
        setProductosSinOfertas(response.data);
      } catch (error) {
        console.error('Error al obtener productos sin ofertas: ', error);
        toast.error('No se pudo cargar el menú.');
      }
    };
  
    obtenerProductosConOfertas();
    obtenerProductosSinOfertas();
  }, []);

  // Función para obtener el producto correspondiente de las ofertas
  const getProductoFromOferta = (idProducto) => {
    return productosSinOfertas.find(producto => producto.id_producto === idProducto);
  };

  // Procesar productos con ofertas
  const productosConOferta = productosConOfertas.map(oferta => {
    const producto = getProductoFromOferta(oferta.id_producto);
    
    if (!producto || !producto.precio) {
      console.error(`Producto sin precio encontrado: ${producto}`);
      return null;
    }
    
    return {
      ...producto,
      tipo: 'oferta',
      precioConDescuento: oferta.valor, 
    };
  }).filter(producto => producto !== null);

  // Obtener IDs de productos que tienen ofertas
  const productosConOfertaIds = productosConOferta.map(producto => producto.id_producto);
  
  // Filtrar productos para el menú (excluyendo los que tienen ofertas)
  const productosParaMenu = productosSinOfertas
    .filter(producto => !productosConOfertaIds.includes(producto.id_producto))
    .map(producto => {
      if (!producto || !producto.precio) {
        console.error(`Producto sin precio encontrado: ${producto}`);
        return null;
      }
      return {
        ...producto,
        tipo: 'sin oferta',
        precioConDescuento: producto.precio,
      };
    })
    .filter(producto => producto !== null);

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
          productos={productosConOferta} 
          nombreBoton={'AÑADIR AL CARRITO'} 
          carruselId={`carrusel-ofertas`}
          onBuyClick={addToCart}
          mostrarPrecio={true} 
        />

        <h1>MENÚ</h1>
        <ProductosCards 
          productos={productosParaMenu}
          nombreBoton={'AÑADIR AL CARRITO'} 
          carruselId={`carrusel-productos`}
          onBuyClick={addToCart}
        />
        
        <h1>NUESTRA UBICACIÓN</h1>
        <MapComponent />
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