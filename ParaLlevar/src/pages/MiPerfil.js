import React from 'react';
import Header from '../assets/components/Header';
import DynamicBreadcrumb from '../assets/components/Bredcrumb';
import MiPerfil from '../assets/components/MiPerfil';
import { Navigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';
const AddCategoria = () => {
    const authToken = Cookies.get('authToken');
  
    if (!authToken) {
        return <Navigate to="/" />;
    }
    return (
        <div>
        <div className='add-miPerfil-page'>
            <Header page={'MiPerfil'}/>
            <DynamicBreadcrumb/>
            <MiPerfil/>
        </div>
        </div>
    );
};

export default AddCategoria;