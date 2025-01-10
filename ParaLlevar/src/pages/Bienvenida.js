import React, { useEffect } from 'react';
import Cookies from 'js-cookie';  // Importar js-cookie

import Header from '../assets/components/Header';
import DynamicBreadcrumb from '../assets/components/Bredcrumb';
import Home from '../assets/components/Home';
import '../assets/styles/informativa.css';

const BienvenidaPage = () => {
  
  const eliminarTodasLasCookies = () => {
    const cookies = Cookies.get();
    for (let cookie in cookies) {
      Cookies.remove(cookie);
    }
  };

  useEffect(() => {
    eliminarTodasLasCookies();
  }, []);

  return (
    <div>
      <div className='bienvenida-page'>
        <Header page={'Informativa'}/>
        <DynamicBreadcrumb/>
        <Home />
      </div>
    </div>
  );
};

export default BienvenidaPage;
