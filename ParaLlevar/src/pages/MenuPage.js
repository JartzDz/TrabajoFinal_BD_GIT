import React, { useState, useEffect } from "react";
import '../assets/styles/menu.css'
import Header from '../assets/components/Header';
import DynamicBreadcrumb from '../assets/components/Bredcrumb';
import Menu from '../assets/components/Menu'
function MenuPage() {
  const [currentSlide, setCurrentSlide] = useState('cliente');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(currentSlide === 'cliente' ? 'negocio' : 'cliente');
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide]);

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header page={'Informativa'} />
        <DynamicBreadcrumb />
        <Menu />
        <div className="waves-background2"></div>
        <div className="contenedorFooterRegistro">
          <div className="textoFooter2">
            Copyright © 2024 Para Llevar. All Rights Reserved.
          </div>
        </div>
      </div>
    );
  }
  export default MenuPage;