//CRUD_categoria.js
import React, { useState, useEffect } from 'react';
import Header from '../assets/components/Header';
import DynamicBreadcrumb from '../assets/components/Bredcrumb';
import CRUDPedidosCliente from '../assets/components/CrudPedidosCliente';
import { Navigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';

const Negocio = () => {
    // Verificar si la cookie authToken está presente
  const authToken = Cookies.get('authToken');
  
  // Si la cookie no está presente, redirigir al usuario a la página de login
  if (!authToken) {
    return <Navigate to="/" />;
  }

    return (
        <div>
            <div className='crud-pedido-page'>
                <Header page={'VerMisPedidos'}/>
                <DynamicBreadcrumb/>
                <CRUDPedidosCliente/>
            </div>
        </div>
    );
};

export default Negocio;