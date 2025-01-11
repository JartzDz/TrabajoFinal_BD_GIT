import React from 'react';
import Header from '../assets/components/Header';
import DynamicBreadcrumb from '../assets/components/Bredcrumb';
import EditProducts from '../assets/components/EditProduct';
import { Navigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const EditProduct = () => {
    const authToken = Cookies.get('authToken');
  
    if (!authToken) {
        return <Navigate to="/" />;
    }
    const decodedToken = jwtDecode(authToken);
    const userRole = decodedToken.role; 

     if (userRole !== 2) {
            return <Navigate to="/Inicio" />; 
        }
    return (
        <div>
        <div className='add-productoEdit-page'>
            <Header page={'EditarProducto'}/>
            <DynamicBreadcrumb/>
            <EditProducts/>
        </div>
        </div>
    );
};

export default EditProduct;