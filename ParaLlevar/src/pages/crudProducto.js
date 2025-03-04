import React from 'react';
import Header from '../assets/components/Header';
import DynamicBreadcrumb from '../assets/components/Bredcrumb';
import CrudProductos from '../assets/components/CRUD-products';
import '../assets/styles/crud-product.css';
import { Navigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

const CrudProducto = () => {
    const authToken = Cookies.get('authToken');
    const role = Cookies.get('role');
    console.log(role)
    if (!authToken) {
        return <Navigate to="/" />;
    }

    const decodedToken = jwt_decode(authToken);
    const userRole = decodedToken.role; 

    console.log('Rol del usuario:', userRole);
    
    if (userRole !== 'admin') {
        return <Navigate to="/" />; 
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