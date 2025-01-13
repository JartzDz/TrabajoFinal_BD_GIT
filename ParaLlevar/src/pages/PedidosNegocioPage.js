import React, { useState, useEffect } from 'react';
import Header from '../assets/components/Header';
import DynamicBreadcrumb from '../assets/components/Bredcrumb';
import { Navigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';
import CRUDPedidosNegocio from '../assets/components/CRUDPedidosNegocio';

const PedidosNegocio = () => {
    // Verificar si la cookie authToken está presente
  const authToken = Cookies.get('authToken');
  
  if (!authToken) {
    return <Navigate to="/" />;
  }

    return (
        <div>
            <div className='crud-pedido-page'>
                <Header page={'VerMisPedidos'}/>
                <DynamicBreadcrumb/>
                <CRUDPedidosNegocio/>
            </div>
        </div>
    );
};

export default PedidosNegocio;