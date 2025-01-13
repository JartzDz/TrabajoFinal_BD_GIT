import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/checkout.css';
import HeaderReturn from '../assets/components/HeaderReturn';
import { FaEdit } from 'react-icons/fa';
import { CartContext } from '../assets/components/CartContext';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GrCheckboxSelected } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExistingAddressModalOpen, setIsExistingAddressModalOpen] = useState(false); 
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [codigo_postal, setCodigoPostal] = useState('');
  const [telefono, setTelefono] = useState('');
  const [pais, setPais] = useState('');
  const [provincia, setProvincia] = useState('');
  const [tipo_direccion, setTipoDireccion] = useState('Casa');
  const [address, setAddress] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]); 

  const token = Cookies.get('authToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id;
      
      if (userId) {
        setUserId(userId);
        fetchUserAddresses(userId); 
      } else {
        console.error('No se encontró el id en el token');
      }
    } catch (error) {
      console.error('Error al decodificar el token o al extraer el id:', error);
    }
  }, [token]);
  
  const fetchUserAddresses = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/direcciones/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.status === 200) {
        setUserAddresses(response.data); 
        console.log('Direcciones obtenidas:', response.data); 
      } else {
        toast.error('No se pudieron cargar las direcciones.');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Error al obtener las direcciones');
    }
  };
  

  const handleDireccionSubmit = async () => {
    if (!direccion || !ciudad || !codigo_postal || !telefono || !provincia || !pais) {
      toast.error("Por favor, complete todos los campos.");
      return;
    }

    if (!/^\d+$/.test(codigo_postal) || codigo_postal.length !== 5) {
      toast.error("El código postal debe ser un número de 5 dígitos.");
      return;
    }

    if (!/^\d+$/.test(telefono) || telefono.length !== 10) {
      toast.error("El número de teléfono debe ser un número de 10 dígitos.");
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      const response = await axios.post('http://localhost:5000/api/direcciones/guardar-direccion', {
        direccion,
        ciudad,
        codigo_postal,
        telefono,
        provincia,
        pais,
        tipo_direccion: tipo_direccion,
        usuario_id: userId 
      }, config);

      if (response.status === 201) {
        setAddress({
          direccion,
          ciudad,
          codigo_postal,
          telefono,
          provincia,
          pais,
          tipo_direccion
        });
        setIsModalOpen(false);
        toast.success("Dirección guardada con éxito.");
      } else {
        toast.error('Error al guardar la dirección');
      }
    } catch (error) {
      toast.error('Error en la solicitud de dirección: ' + error.message);
    }
  };

  const handleEditDireccion = () => {
    if (address) {
      setDireccion(address.direccion);
      setCiudad(address.ciudad);
      setCodigoPostal(address.codigo_postal);
      setTelefono(address.telefono);
      setProvincia(address.provincia);
      setPais(address.pais);
      setTipoDireccion(address.tipo_direccion);
      setIsModalOpen(true);
    }
  };

  const handleSelectAddress = (selectedAddress) => {
    setDireccion(selectedAddress.direccion);
    setCiudad(selectedAddress.ciudad);
    setCodigoPostal(selectedAddress.codigo_postal);
    setTelefono(selectedAddress.telefono);
    setProvincia(selectedAddress.provincia);
    setPais(selectedAddress.pais);
    setTipoDireccion(selectedAddress.tipo_direccion);
    setIsExistingAddressModalOpen(false);
    
    toast.success("Dirección seleccionada con éxito.");
  };
  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const impuestos = subtotal * 0.12;
    return subtotal + impuestos;
  };

  return (
    <div className="checkout-container">
      <HeaderReturn />
      <div className="waves-background"></div>
      <h1 style={{ marginTop: '2rem' }}>CHECKOUT</h1>
      <ToastContainer 
        closeButtonStyle={{ fontSize: '12px', padding: '4px' }} 
        style={{ width: '400px', marginTop: '4rem' }} 
      />
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Ingresa tu Dirección</h2>
            <label>
              Dirección:
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </label>
            <label>
              Ciudad:
              <input
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
              />
            </label>
            <label>
              Provincia:
              <input
                type="text"
                value={provincia}
                onChange={(e) => setProvincia(e.target.value)}
              />
            </label>
            <label>
              País:
              <input
                type="text"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
              />
            </label>
            <label>
              Código Postal:
              <input
                type="text"
                value={codigo_postal}
                onChange={(e) => setCodigoPostal(e.target.value)}
              />
            </label>
            <label>
              Teléfono:
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </label>
            <label>
              Tipo de Dirección:
              <select
                value={tipo_direccion}
                onChange={(e) => setTipoDireccion(e.target.value)}
              >
                <option value="Casa">Casa</option>
                <option value="Trabajo">Trabajo</option>
                <option value="Otra">Otra</option>
              </select>
            </label>
            <div className="button-container">
              <button onClick={handleDireccionSubmit}>Guardar</button>
              <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

{isExistingAddressModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <h2>Selecciona una Dirección Existente</h2>
      <ul className="direcciones-lista">
        {userAddresses.map((direccion) => (
          <li key={direccion.id} className="direccion-item">
            <span>{direccion.direccion} - {direccion.tipo_direccion} </span>
            <div className="acciones">
              <button onClick={""}>
              <GrCheckboxSelected className='accion-icon'/>

              </button>
              <button  onClick={"() => eliminarDireccion(direccion.id)"} >
              <MdDelete className='accion-icon'/>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="button-container">
        <button onClick={() => setIsExistingAddressModalOpen(false)}>Cancelar</button>
      </div>
    </div>
  </div>
)}

      <div className="order-summary-container">
        <div className="order-summary-left">
          <h2 style={{ fontSize: '28px' }}>Resumen del Pedido</h2>
          <div className="cart-summary">
            <h3>Productos</h3>
            <ul>
              {cartItems.map((item) => (
                <li key={item.id_producto}>
                  <span>{item.nombre} x {item.cantidad}</span>
                  <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className='totales'>
              <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
              <p>Impuestos: ${(calculateSubtotal() * 0.12).toFixed(2)}</p>
            </div>
            <h3>Total: ${calculateTotal().toFixed(2)}</h3>
          </div>
        </div>

        <div className="order-summary-right">
          <h2 style={{ fontSize: '28px' }}>Dirección y Método de Pago</h2>
          {address ? (
            <div className="address-info">
              <h3>Dirección de Entrega</h3>
              <p>{address.direccion}, {address.ciudad}, {address.codigo_postal}</p>
              <p>Teléfono: {address.telefono}</p>
              <p>Provincia: {address.provincia}</p>
              <p>País: {address.pais}</p>
              <p>Tipo de Dirección: {address.tipo_direccion}</p>
              <button onClick={handleEditDireccion}>
                <FaEdit /> Editar Dirección
              </button>
            </div>
          ) : (
            <div className="address-buttons">
              <button onClick={() => setIsExistingAddressModalOpen(true)}>Agregar Dirección Existente</button>
              <button onClick={() => setIsModalOpen(true)}>Agregar Nueva Dirección</button>
            </div>
          )}

          <div className="payment-method">
            <h3>Selecciona el Método de Pago</h3>
            <label>
              <input type="radio" name="payment" value="credit-card" /> Tarjeta de Crédito
            </label>
            <label>
              <input type="radio" name="payment" value="paypal" /> PayPal
            </label>
          </div>

          <button className="confirm-button">Confirmar Pedido</button>
        </div>
      </div>

      <div className="contenedorFooter">
        <div className="textoFooter2">
          Copyright © 2024 Para Llevar. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
