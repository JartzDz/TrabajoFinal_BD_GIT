import React, { useState, useEffect } from "react";
import "../styles/crud-product.css";
import buscar from "../images/buscar.png";
import DataTable from "react-data-table-component";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { Table } from "antd"; 
import axios from 'axios'; // Importa Axios
import { ToastContainer, toast } from 'react-toastify';

function CRUDProducts() {
    const [productos, setProductos] = useState([]);

    const obtenerProducto = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/productos');
            console.log('Respuesta completa de la API:', response);
            setProductos(response.data); 
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };
    useEffect(() => {
        obtenerProducto();
    }, []);
    
    const recargarProductos = async () => {
        await obtenerProducto();
    };

    const eliminarProducto = async (id_producto) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/productos/eliminar/${id_producto}`);
            
            if (response.data && response.data.message === 'Producto eliminado') {
                console.log('Producto eliminado:', response.data);
                
                const nuevosProductos = productos.filter((producto) => producto.id !== id_producto); 
                setProductos(nuevosProductos); 
                
                toast.success('Producto eliminado correctamente');
            } else {
                toast.error('No se pudo eliminar el producto.');
            }
        } catch (error) {
            toast.error('Error al eliminar el producto.');
            console.error('Error al eliminar producto:', error);
        }
    };
    

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id', 
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Nombre Producto',
            dataIndex: 'nombre_producto',
            key: 'nombre_producto',
            sorter: (a, b) => a.nombre_producto.localeCompare(b.nombre_producto),
        },
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
            sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
        },
        {
            title: 'Precio',
            dataIndex: 'precio',
            key: 'precio',
            sorter: (a, b) => a.precio - b.precio,
        },
        {
            title: 'Imagen',
            dataIndex: 'imagen',
            key: 'imagen',
            render: imagen => {
                const imageUrl = `http://localhost:5000/${imagen}`;
                console.log(imageUrl);
                return <img src={imageUrl} alt="Imagen del producto" className="producto-imagen" />;
              },
        },
        {
            title: 'Oferta',
            dataIndex: 'es_oferta',
            key: 'es_oferta',
            render: es_oferta => es_oferta ? 'Sí' : 'No',
            sorter: (a, b) => a.es_oferta - b.es_oferta,
        },
        {
            title: '',
            key: 'editar',
            render: (_, registro) => (
                <div className="botonesCrudCategoria">
                    <React.Fragment>   
                        <Link to={`/registroProductos/editarProducto/`} onClick={() => editar_producto(registro.id)}>
                            <button className="EditarProd" title="Editar Producto">
                                <FiEdit size={25}/>
                            </button>
                        </Link>
                    </React.Fragment>
                </div>
            ),
            width:10,
        },
        {
            title: '',
            key: 'eliminar',
            render: (_, registro) => (
                <div className="botonesCrudCategoria">
                    <button className="EliminarProd" title="Eliminar Producto" onClick={() => eliminarProducto(registro.id)}>
                        <BsTrash size={25}/>
                    </button>
                </div>
            ),
            width:10,
        },
    ];

    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = productos && productos.length > 0 ? productos.filter(producto =>
        producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const editar_producto = (id) => {
        sessionStorage.setItem('id_producto', id);
    };

    return (
        <body className="container-crud-prod">
            <main className="crud-producto-container">
                <div className="crud-producto">
                    <div className="BusquedaProducto">
                        <img className="FotoBuscar" src={buscar} alt="Buscar" />
                        <input
                            type="text"
                            className="TextoBusquedaProducto"
                            placeholder="Buscar Producto"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <React.Fragment>
                        <a href="/registroProductos/agregarProducto"><button className='botonAgregarProducto'>Agregar Producto</button></a>
                    </React.Fragment>
                </div>
                <div className="tabla-productos-container">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                    />
                </div>
            </main>
            <footer className="contenedorFooter-prod">
                <div className="textoFooter2">
                    Copyright © 2024 Para Llevar. All Rights Reserved.
                </div>
            </footer>
            <ToastContainer
                closeButtonStyle={{
                    fontSize: '12px', 
                    padding: '4px'    
                    }}
                style={{ width: '400px' }} 
                autoClose={2000}
            />
            <div className="waves-background2-prod"></div>
        </body>
    );
}

export default CRUDProducts;
