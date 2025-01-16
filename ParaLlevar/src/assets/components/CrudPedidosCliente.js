import React, { useState, useEffect,useContext} from "react";
import { Table } from "antd";
import Cookies from 'js-cookie';
import axios from 'axios'; // Importa Axios
import { ToastContainer, toast } from 'react-toastify';
import "../styles/crud-pedidos.css"
import buscar from "../images/buscar.png";
import { CartContext } from './CartContext';
import Cart from './Cart'; 
import Header from './Header';

function CRUDPedidosCliente() {
    const [pedidos, setPedidos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartVisible, setCartVisible] = useState(false);  
    const { cartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [calificacion,setCalificacion] = useState('')
    const [comentario,setComentario] = useState('')
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const toggleCart = () => {
        setCartVisible(!cartVisible); 
      };
    const token = Cookies.get('authToken');

    useEffect(() => {
        const obtenerPedidos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/pedidos', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('authToken')}`
                    }
                });
                setPedidos(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Error al obtener los pedidos", error);
                toast.error("Hubo un error al cargar los pedidos.");
            }
        };

        obtenerPedidos();
    }, []);

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
            setPedidos(pedidos.filter(pedido => pedido.id_pedido !== id_pedido));
        } catch (error) {
            console.error('Error al cancelar el pedido', error);
            toast.error('Hubo un error al cancelar el pedido.');
        }
    };
    
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.id;
    const enviarResena = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/pedidos/resenias', {
                id_usuario: userId, 
                id_pedido: pedidoSeleccionado.id_pedido,
                calificacion,
                comentario
            }, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('authToken')}`
                }
            });
            console.log(response.data)
            toast.success('Reseña agregada correctamente.');
            setCalificacion(''); 
            setComentario('');
            setIsModalOpen(false); 
        } catch (error) {
            console.error('Error al agregar la reseña', error);
            toast.error('Hubo un error al agregar la reseña.');
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
            title: 'Acciones',
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
                    {registro.estado === "Entregado" && ( 
                       <button 
                       style={{ width: '200px' }}
                       onClick={() => {
                           setPedidoSeleccionado(registro);
                           setIsModalOpen(true);
                       }}
                   >
                       Agregar Reseña
                   </button>
                    )}
                </>
            ),
        },
    ];

    const handleOpenModal = () => {
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsModalOpen(false);
      };
  
      
    return (
        
        <body className="container-crud-pedido">
               <Header onCartClick={toggleCart} />
                    
                {cartVisible && (
                    <Cart
                        cartItems={cartItems}
                        onIncreaseQuantity={increaseQuantity}
                        onDecreaseQuantity={decreaseQuantity}
                        onRemoveItem={removeFromCart}
                        />
                )}
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
                        {isModalOpen && (
                        <div className="modal">
                        <div className="modal-content">
                            <h2>Ingresa tu reseña</h2>                           
                            <label>
                            Calificación:
                            <input
                                type="number"
                                value={calificacion}
                                max="5"
                                min="1"
                                onChange={(e) => {
                                    const value = Math.min(5, Math.max(1, Number(e.target.value))); 
                                    setCalificacion(value);
                                }}
                            />
                            </label>
                            <label>
                            Comentario:
                            <input
                                type="text"
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                            />
                            </label>
                            
                            <div className="button-container">
                            <button onClick={enviarResena}>Enviar</button>
                            <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
                            </div>
                        </div>
                        </div>
                    )}
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
