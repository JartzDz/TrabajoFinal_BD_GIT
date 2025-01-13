//CRUD_categoria.js
import React from 'react';
import Header from '../assets/components/Header';
import DynamicBreadcrumb from '../assets/components/Bredcrumb';
import AddTipoOferta from '../assets/components/AddTipoOferta';
import { Navigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';

const CrudCategoria = () => {
    const authToken = Cookies.get('authToken');
  
    if (!authToken) {
        return <Navigate to="/" />;
    }
    
    return (
        <div>
            <div className='crud-tipoOfertas-page'>
                <Header page={'RegistroTipoOfertas'}/>
                <DynamicBreadcrumb/>
                <AddTipoOferta/>
            </div>
        </div>
    );
};

export default CrudCategoria;