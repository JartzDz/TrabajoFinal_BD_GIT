import React from 'react';
import '../styles/cart.css';
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom'; 

const Cart = ({ cartItems, onIncreaseQuantity, onDecreaseQuantity, onRemoveItem }) => {
  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate('/checkout'); 
  };

  return (
    <div className="cart">
      <h2>Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id_producto} className="cart-item">  
              <div className="item-details">
                <img 
                  src={`http://localhost:5000/${item.imagen_url}`} 
                  alt={item.nombre} 
                  className="item-image" 
                />
                <div className='nameProduct'>
                  <h3>{item.nombre}</h3>  
                  <p>${item.precioConDescuento ? item.precioConDescuento : item.precio}</p> {/* Aquí se usa el precio con descuento si existe */}
                </div>
              </div>
              <div className="item-quantity">
                <button onClick={() => onDecreaseQuantity(item.id_producto)}>-</button> 
                <span>{item.cantidad}</span>
                <button onClick={() => onIncreaseQuantity(item.id_producto)}>+</button>  
              </div>
              <button className="remove-button" onClick={() => onRemoveItem(item.id_producto)}><MdDelete className='icon'/></button>  
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleCheckout} className="checkout-button">Ir a Pagar</button>
    </div>
  );
};

export default Cart;
