// ClientePage.js
import React from 'react';
import Header from '../assets/components/Header';
import DynamicBreadcrumb from '../assets/components/Bredcrumb';
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import HomeNegocio from '../assets/components/HomeNegocio';

const NegocioPage = () => {
  const authToken = Cookies.get('authToken');
  const userRole = Cookies.get('role');
  
  if (!authToken || userRole !== '2') {
    if (!authToken) {
      return <Navigate to="/" />;
    }
    return <Navigate to="/Inicio" />;
  }

  return (
    <div>
      <div className='client-page'>
        <Header />
        <DynamicBreadcrumb/>
        <HomeNegocio/>
      </div>
    </div>
  );
};

export default NegocioPage;