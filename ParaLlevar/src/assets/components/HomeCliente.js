import React, { useState, useEffect } from "react";
import pizza from '../images/pizza.png';
import axios from 'axios';
import MapComponent from './MapComponent'; 
import '../styles/cliente.css';
import ProductosCards from "./ProductoCards";

function HomeCliente() {
  const [productos, setProductos] = useState([]); //Aqui se almacenan los productos

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

  return (
    <div className='ClienteContainer'>
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
        {/* Asegúrate de pasar los productos a ProductosCards */}
        <ProductosCards 
          productos={productos} 
          nombreBoton={'AÑADIR AL CARRITO'} 
          carruselId={`carrusel-productos-ofertas`}
        />
        
        <h1>MENÚ</h1>
        {/* Pasa los productos también al menú */}
        <ProductosCards 
          productos={productos} 
          nombreBoton={'AÑADIR AL CARRITO'} 
          carruselId={`carrusel-productos`}
        />
        
        <h1>NUESTRA UBICACIÓN</h1>
        <MapComponent/>
      </div>
      <div className="contenedorFooter">
        <div className="textoFooter2">
          Copyright © 2024 Para Llevar. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}

export default HomeCliente;
