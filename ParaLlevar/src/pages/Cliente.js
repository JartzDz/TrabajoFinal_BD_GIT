import React from 'react';
import Header from '../assets/components/Header';
import DynamicBreadcrumb from '../assets/components/Bredcrumb';
import HomeCliente from '../assets/components/HomeCliente';
import '../assets/styles/cliente.css'
import { Navigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';

const ClientePage = () => {
  // Verificar si la cookie authToken está presente
  const authToken = Cookies.get('authToken');
  
  if (!authToken) {
    return <Navigate to="/" />;
  }

  return (
    
    <div>
      <div className='client-page'>
        <Header />
        <DynamicBreadcrumb/>
        <HomeCliente />
      </div>
    </div>
  );
};

export default ClientePage;