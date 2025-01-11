import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import '../assets/styles/checkout.css';
import HeaderReturn from '../assets/components/HeaderReturn';
import { FaEdit } from 'react-icons/fa'; // Importar el icono de editar
import { CartContext } from '../assets/components/CartContext'; // Importar el contexto del carrito

const CheckoutPage = () => {
  const navigate = useNavigate(); 
  const { cartItems } = useContext(CartContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [telefono, setTelefono] = useState('');
  const [address, setAddress] = useState(null);

  const handleDireccionSubmit = () => {
    setAddress({ direccion, ciudad, codigoPostal, telefono });
    setIsModalOpen(false); // Cierra el modal una vez se ingrese la dirección
  };

  const handleEditDireccion = () => {
    setDireccion(address.direccion);
    setCiudad(address.ciudad);
    setCodigoPostal(address.codigoPostal);
    setTelefono(address.telefono);
    setIsModalOpen(true); // Abre el modal para editar la dirección
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
              Código Postal:
              <input
                type="text"
                value={codigoPostal}
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
            <div className="button-container">
              <button onClick={handleDireccionSubmit}>Guardar</button>
              <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
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
              <p>{address.direccion}, {address.ciudad}, {address.codigoPostal}</p>
              <p>Teléfono: {address.telefono}</p>
              <button onClick={handleEditDireccion}>
                <FaEdit /> Editar Dirección
              </button>
            </div>
          ) : (
            <button onClick={() => setIsModalOpen(true)}>Agregar Dirección</button>
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
