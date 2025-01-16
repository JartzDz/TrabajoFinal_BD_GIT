import React, { useState, useEffect } from "react";
import { Table } from "antd";
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import "../styles/crud-pedidos.css";
import buscar from "../images/buscar.png";

function CRUDPedidosNegocio() {
    const [pedidos, setPedidos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
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

    const cancelarPedido = async (id_pedido) => {
        try {
            await axios.put('http://localhost:5000/api/pedidos/cancelar', 
                { id_pedido }, 
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('authToken')}`
                    }
                }
            );
            toast.success('Pedido cancelado correctamente.');
            setPedidos(pedidos.filter(pedido => pedido.id_pedido !== id_pedido));
        } catch (error) {
            console.error('Error al cancelar el pedido', error);
            toast.error('Hubo un error al cancelar el pedido.');
        }
    };

    const marcarComoEntregado = async (idPedido) => {
        try {
          const response = await axios.put(`http://localhost:5000/api/pedidos/entregar/${idPedido}`, {}, {
            headers: {
                Authorization: `Bearer ${Cookies.get('authToken')}`
            },
          });
          toast.success('Pedido marcado como entregado.');

          setPedidos(prevPedidos => prevPedidos.map(pedido =>
              pedido.id_pedido === idPedido ? { ...pedido, estado: 'Entregado' } : pedido
          ));
          console.log('Pedido marcado como entregado:', response.data);
        } catch (error) {
          console.error('Error al marcar como entregado:', error.response ? error.response.data : error.message);
        }
      };

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
            title: 'Productos',
            key: 'productos',
            render: (_, registro) => (
              <ul>
                {registro.productos && registro.productos.length > 0 ? (
                  registro.productos.map((producto, index) => (
                    <li key={index}>
                      {producto.producto ? `Producto: ${producto.producto}` : 'Producto sin nombre'} - 
                      {producto.cantidad ? `Cantidad: ${producto.cantidad}` : 'Cantidad no disponible'}
                    </li>
                  ))
                ) : (
                  'No hay productos'
                )}
              </ul>
            ),
        },
        {
            title: '',
            key: 'acciones',
            render: (_, registro) => (
                <>
                    {registro.estado === 'En proceso' && (
                        <button 
                            className="CancelarPedido" 
                            onClick={() => cancelarPedido(registro.id_pedido)}
                        >
                            Cancelar Pedido
                        </button>
                    )}
                    {registro.estado !== 'Entregado' && (
                       <button 
                       className="MarcarEntregado" 
                       style={{ width: '250px' }}
                       onClick={() => marcarComoEntregado(registro.id_pedido)}
                   >
                       Marcar Entregado
                   </button>
                   
                    )}
                </>
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

export default CRUDPedidosNegocio;
