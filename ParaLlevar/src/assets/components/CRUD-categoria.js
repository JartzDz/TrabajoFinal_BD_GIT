import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Table } from "antd";
import "../styles/crud-categoria.css";
import buscar from "../images/buscar.png";
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'; // Importa Axios
import Cookies from 'js-cookie'; 

function CRUDCategoria() {
    const [categorias, setCategorias] = useState([]); // Estado para las categorías
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id_categoria',
            key: 'id_categoria',
            sorter: (a, b) => a.id_categoria - b.id_categoria,
        },
        {
            title: 'Categoría',
            dataIndex: 'nombre',
            key: 'nombre', 
            sorter: (a, b) => a.nombre.localeCompare(b.nombre), 
        },
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
            sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
        },
        {
            title: 'Habilitado',
            dataIndex: 'estado',
            key: 'estado',
            render: estado => (estado ? 'Activo' : 'Inactivo'),
            sorter: (a, b) => a.estado - b.estado,
        },
        {
            title: 'Fecha de Creación',
            dataIndex: 'creado_en',
            key: 'creado_en',
            sorter: (a, b) => new Date(a.creado_en) - new Date(b.creado_en),
        },
        {
            title: '',
            key: 'editar',
            fixed: 'left',
            render: (_, registro) => (
                <div className="botonesCrudCategoria">
                    <Link to={`/RegistroCategoria/editarCategoria/`} onClick={() => editar_categoria(registro.id_categoria)}>
                        <button className="EditarProd" title="Editar Categoría">
                            <FiEdit size={25} />
                        </button>
                    </Link>
                </div>
            ),
            width: 10,
        },
        {
            title: '',
            key: 'eliminar',
            fixed: 'left',
            render: (_, registro) => (
                <div className="botonesCrudCategoria">
                    <button className="EliminarProd" title="Eliminar Categoría" onClick={() => eliminarCategoria(registro.id_categoria)}>
                        <BsTrash size={25} />
                    </button>
                </div>
            ),
            width: 10,
        },
    ];
    
    const filteredData = categorias.filter(categoria =>
        categoria.nombre && categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
    


    useEffect(() => {
        axios.get("http://localhost:5000/api/categorias", {
            headers: {
                Authorization: `Bearer ${Cookies.get('authToken')}`,
            }
        })
        .then(response => {
            console.log(response.data); 
            setCategorias(response.data);
        })
        .catch(error => {
            console.error("Hubo un error al obtener las categorías:", error);
            toast.error("Error al cargar las categorías.");
        });
        
    }, []);
    


    const editar_categoria = (id) => {
        sessionStorage.setItem('id_categoria', id);
    };

    const eliminarCategoria = (id) => {
        axios.delete(`http://localhost:5000/api/categorias/${id}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get('authToken')}`,
            }
        })
        .then(() => {
            setCategorias(categorias.filter(categoria => categoria.id_categoria !== id)); 
            toast.success("Categoría eliminada correctamente.");
        })
        .catch(error => {
            console.error("Hubo un error al eliminar la categoría:", error);
            toast.error("Error al eliminar la categoría.");
        });
    };
    

    return (
        <div className="container-crud-categoria">
            <main className="crud-categoria-container">
                <div className="crud-categoria">
                    <div className="BusquedaCategoria">
                        <img className="FotoBuscarCategoria" src={buscar} alt="Buscar" />
                        <input
                            type="text"
                            className="TextoBusquedaCategoria"
                            placeholder="Buscar Categoría"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                    <Link to="/RegistroCategoria/AgregarCategoria">
                        <button className='botonAgregarCategoria'>Agregar Categoría</button>
                    </Link>
                </div>
                <div className="tabla-categoria-container">
                    <Table
                        columns={columns}
                        dataSource={filteredData} 
                    />
                </div>
            </main>
            <ToastContainer
                style={{ width: '400px' }} 
                autoClose={2000}
                closeButton={false}
            />
        </div>
    );
}

export default CRUDCategoria;
