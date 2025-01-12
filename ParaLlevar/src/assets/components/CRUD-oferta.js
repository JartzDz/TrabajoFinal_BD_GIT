// frontend/src/components/CRUDOferta.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import "../styles/crud-product.css";
import buscar from "../images/buscar.png";
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import Cookies from 'js-cookie';
import axios from 'axios'; // Importa Axios
import { Table } from "antd"; 
import { ToastContainer, toast } from 'react-toastify';

function CRUDOferta() {
    
    const [ofertas, setOfertas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Función para obtener las ofertas desde el backend
    useEffect(() => {
        const obtenerOfertas = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/ofertas', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('authToken')}`  
                    }
                });
                setOfertas(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Error al obtener las ofertas", error);
                toast.error("Hubo un error al cargar las ofertas.");
            }
        };
        
        obtenerOfertas();
    }, []);  
    const editar_oferta = (id_oferta) => {
        sessionStorage.setItem('id_oferta', id_oferta);
    };

    const eliminarOferta = async (id_oferta) => {
        try {
            const response = await axios.delete('http://localhost:5000/api/ofertas/eliminar', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('authToken')}`
                },
                data: { id_oferta }
            });

            toast.success('Oferta eliminada correctamente.');
            setOfertas(ofertas.filter(oferta => oferta.id_oferta !== id_oferta));  // Actualiza el estado
        } catch (error) {
            console.error('Error al eliminar la oferta', error);
            toast.error('Hubo un error al eliminar la oferta.');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id_oferta',
            key: 'id_oferta',
            sorter: (a, b) => a.id_oferta - b.id_oferta,
        },
        {
            title: 'Tipo de Oferta',
            dataIndex: 'tipo_oferta',
            key: 'tipo_oferta',
            sorter: (a, b) => a.tipo_oferta.localeCompare(b.tipo_oferta),
        },
        
        {
            title: 'Producto(s) Asociado(s)',
            dataIndex: 'nombre', 
            key: 'nombre',
            render: nombre => nombre ? nombre : 'No asociado',  
        },
        {
            title: 'Precio',
            dataIndex: 'valor',
            key: 'valor',
            sorter: (a, b) => parseFloat(a.valor) - parseFloat(b.valor),
        },
        {
            title: 'Fecha de Creación',
            dataIndex: 'fecha_inicio',
            key: 'fecha_inicio',
            sorter: (a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio),
        },
        {
            title: '',
            key: 'editar',
            render: (_, registro) => (
                <div className="botonesCrudCategoria">
                    <Link to={`/RegistroOfertas/EditarOferta`}>
                        <button className="EditarProd" title="Editar Oferta" onClick={() => editar_oferta(registro.id_oferta)}>
                            <FiEdit size={25} />
                        </button>
                    </Link>
                </div>
            ),
        },
        {
            title: '',
            key: 'eliminar',
            render: (_, registro) => (
                <div className="botonesCrudCategoria">
                    <button className="EliminarProd" title="Eliminar Oferta" onClick={() => eliminarOferta(registro.id_oferta)}>
                        <BsTrash size={25} />
                    </button>
                </div>
            ),
        },
    ];
    

    const filteredData = ofertas.filter(oferta =>
        oferta.tipo_oferta && oferta.tipo_oferta.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    

    return (
        <div className="container-crud-prod">
            <main className="crud-producto-container">
                <div className="crud-producto">
                    <div className="BusquedaProducto">
                        <img className="FotoBuscar" src={buscar} alt="Buscar" />
                        <input
                            type="text"
                            className="TextoBusquedaProducto"
                            placeholder="Buscar Oferta"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <React.Fragment>
                        <a href="/RegistroOfertas/AgregarOferta">
                            <button className='botonAgregarProducto'>Agregar Oferta</button>
                        </a>
                    </React.Fragment>
                </div>
                <div className="tabla-productos-container">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                    />
                </div>
            </main>
            
            <div className="waves-background2-prod"></div>
            <ToastContainer
                style={{ width: '400px' }} 
                autoClose={2000}
                closeButton={false}
            />
        </div>
    );
}

export default CRUDOferta;
