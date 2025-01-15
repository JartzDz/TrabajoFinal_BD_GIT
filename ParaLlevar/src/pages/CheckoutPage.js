import React from 'react';
import DynamicBreadcrumb from '../assets/components/Bredcrumb';
import '../assets/styles/cliente.css'
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import HeaderReturn from '../assets/components/HeaderReturn';
import Checkout from '../assets/components/Checkout';
const ClientePage = () => {
  // Verificar si la cookie authToken está presente
  const authToken = Cookies.get('authToken');
  
  if (!authToken) {
    return <Navigate to="/" />;
  }

  return (
    
    <div>
      <div className='client-page' style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <HeaderReturn/>
        <DynamicBreadcrumb/>
        <Checkout/>
      </div>
    </div>
  );
};

export default ClientePage;