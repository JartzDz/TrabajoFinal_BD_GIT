import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import Cookies from 'js-cookie';
import axios from 'axios'; // Importa Axios
import { ToastContainer, toast } from 'react-toastify';
import "../styles/crud-pedidos.css"
import buscar from "../images/buscar.png";

function CRUDPedidosCliente() {
    const [pedidos, setPedidos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Función para obtener los pedidos del usuario
    useEffect(() => {
        const obtenerPedidos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/pedidos', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('authToken')}`
                    }
                });
                setPedidos(response.data);
            } catch (error) {
                console.error("Error al obtener los pedidos", error);
                toast.error("Hubo un error al cargar los pedidos.");
            }
        };

        obtenerPedidos();
    }, []);

    // Función para cancelar un pedido
    const cancelarPedido = async (id_pedido) => {
        try {
            const response = await axios.put('http://localhost:5000/api/pedidos/cancelar', 
                { id_pedido }, 
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('authToken')}`
                    }
                }
            );

            toast.success('Pedido cancelado correctamente.');
            setPedidos(pedidos.filter(pedido => pedido.id_pedido !== id_pedido)); // Actualiza el estado
        } catch (error) {
            console.error('Error al cancelar el pedido', error);
            toast.error('Hubo un error al cancelar el pedido.');
        }
    };

    // Filtrar los pedidos por búsqueda
    const filteredData = pedidos.filter(pedido =>
        pedido.id_pedido.toString().includes(searchTerm.toLowerCase()) ||
        pedido.fecha_pedido.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: 'ID Pedido',
            dataIndex: 'id_pedido',
            key: 'id_pedido',
            sorter: (a, b) => a.id_pedido - b.id_pedido,
        },
        {
            title: 'Fecha de Pedido',
            dataIndex: 'fecha_pedido',
            key: 'fecha_pedido',
            sorter: (a, b) => new Date(a.fecha_pedido) - new Date(b.fecha_pedido),
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
        },
        {
            title: '',
            key: 'cancelar',
            render: (_, registro) => (
                registro.estado === 'En proceso' && (
                    <button 
                        className="CancelarPedido" 
                        onClick={() => cancelarPedido(registro.id_pedido)}
                    >
                        Cancelar Pedido
                    </button>
                )
            ),
        },
    ];

    return (
        <body className="container-crud-pedido">
                <main className="crud-pedidos-container">
                    <div className="crud-pedido">
                        <div className="BusquedaPedido">
                            <img className="FotoBuscar" src={buscar} alt="Buscar" />
                                <input
                                    type="text"
                                    className="TextoBusquedaPedido"
                                    placeholder="Buscar Pedido"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <React.Fragment>
                            </React.Fragment>
                        </div>
                        <div className="tabla-pedidos-container">
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
                <div className="waves-background2-prod"></div>
        </body>
    );
}

export default CRUDPedidosCliente;
