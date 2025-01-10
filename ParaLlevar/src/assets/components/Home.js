import React, { useState, useEffect } from "react";
import '../styles/informativa.css'
import bolsa2 from '../images/bolsa2.jpg'
import bolsa3 from '../images/bolsa3.jpg'
import bolsa4 from '../images/bolsa4.jpg'
import Cookies from 'js-cookie';
function Home() {
  const [currentSlide, setCurrentSlide] = useState('cliente');
  const rol = Cookies.get('rol');
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(currentSlide === 'cliente' ? 'negocio' : 'cliente');
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  
    return (
        <div className="HomeContainer">
            <div className='textoImagen'>
              <h1 className='tituloPrincipal'>!La mejor comida está aquí¡</h1>
              <div className='textoInformativo'>
                  <p className='subtexto'>La mejor comida la encuentras aqui. ¡Para Llevar te lo hace posible!</p>
              </div>
            </div>
            <div className="waves-background2"></div>
            <div className="contenedorRojo"></div>
            <div className="contenedorBlanco">
                <h1 className="tituloNosotros">Para Llevar</h1>
                <div className="linea"></div>
                <div className='seccionIniciativa'>
                  <div className='seccionMensaje'>
                    <div className='seccionImagen'>
                      <img src={bolsa2} alt="Bolsa 1" className="imagenSecundaria" />
                      <img src={bolsa3} alt="Bolsa 2" className="imagenPrimaria" />
                      <img src={bolsa4} alt="Bolsa 3" className="imagenSecundaria" />
                    </div>
                    <div className='texto-seccionImagen'>
                      <p >¡Ingresa y disfruta de lo mejor!</p>
                    </div>
                  </div>
                  <div className='seccionTexto'>
                    <h1>NOSOTROS</h1>
                    <div className='textoIniciativa'>
                      <p>En Para Llevar, nos apasiona llevar la mejor experiencia gastronómica directamente a tu puerta. Fundados con el propósito de hacer que disfrutar de tus platos favoritos sea más fácil, rápido y conveniente, ofrecemos un servicio de comida a domicilio de alta calidad, con un amplio menú que se adapta a todos los gustos y necesidades.</p>
                    </div>
                  </div>
                </div>
            </div>
            <div className="contenedorFooter">
              <div className="textoFooter2">
                Copyright © 2024 Too Good To Go International. All Rights Reserved.
              </div>
            </div>
        </div>

    );
    
    
  }
  
  export default Home;