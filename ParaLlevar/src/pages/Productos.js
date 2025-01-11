import React from 'react';
import Header from '../assets/components/Header';
import DynamicBreadcrumb from '../assets/components/Bredcrumb';
import CrudProductos from '../assets/components/CRUD-products';
import '../assets/styles/crud-product.css';
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const CrudProducto = () => {
    const authToken = Cookies.get('authToken');
  
    if (!authToken) {
        return <Navigate to="/" />;
    }

    const decodedToken = jwtDecode(authToken);
    const userRole = decodedToken.role; 
    
    console.log('Rol del usuario:', userRole);
        
    if (userRole !== 2) {
        return <Navigate to="/Inicio" />; 
    }
    

    return (
        <div>
            <div className='crud-producto-page'>
                <Header page={'RegistroProductos'}/>
                <DynamicBreadcrumb/>
                <CrudProductos/>
            </div>
        </div>
    );
};

export default CrudProducto;