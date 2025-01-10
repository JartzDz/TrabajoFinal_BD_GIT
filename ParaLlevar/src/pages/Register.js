import React, { useState, useEffect } from "react";
import '../assets/styles/registro.css'
import Header from '../assets/components/Header';
import DynamicBreadcrumb from '../assets/components/Bredcrumb';
function Register() {
  const [currentSlide, setCurrentSlide] = useState('cliente');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(currentSlide === 'cliente' ? 'negocio' : 'cliente');
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide]);

    return (
      <>
        <Header page={'Informativa'}/>
        <DynamicBreadcrumb/>
        <div className="RegisterContainer">
            <div className='textoImagen'>
              <h1 className='textoToGo'>La misma calidad pero en casa </h1>
              <h1 className='textoTooGood'>Regístrate</h1>
              <div className='textoInformativo'>
                  <p className='subtexto'>Únete para disfrutar de lo mejor, lo mejor lo encuentras aquí</p>
              </div>
            </div>
            <div className="botonesRegistro">
              <a href="/Registro-Cliente"><button className='buttonRegistrarse'>Registrarse</button></a>
            </div>
            <div className="waves-background2"></div>
            <div className="contenedorFooterRegistro">
              <div className="textoFooter2">
                Copyright © 2024 Para Llevar. All Rights Reserved.
              </div>
            </div>
        </div>
      </>
    );
  }
  export default Register;