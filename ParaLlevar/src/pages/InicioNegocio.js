// ClientePage.js
import React from 'react';
import Header from '../assets/components/Header';
import DynamicBreadcrumb from '../assets/components/Bredcrumb';
import { Navigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';
import HomeNegocio from '../assets/components/HomeNegocio';
const NegocioPage = () => {
  const authToken = Cookies.get('authToken');
  
  if (!authToken) {
    return <Navigate to="/" />;
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