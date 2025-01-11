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
            <li key={item.id} className="cart-item">
              <div className="item-details">
                <img src={`http://localhost:5000/${item.imagen}`} alt={item.nombre_producto} className="item-image" />
                <div className='nameProduct'>
                  <h3>{item.nombre_producto}</h3>
                  <p>${item.precio}</p>
                </div>
              </div>
              <div className="item-quantity">
                <button onClick={() => onDecreaseQuantity(item.id)}>-</button>
                <span>{item.cantidad}</span>
                <button onClick={() => onIncreaseQuantity(item.id)}>+</button>
              </div>
              <button className="remove-button" onClick={() => onRemoveItem(item.id)}><MdDelete className='icon'/></button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleCheckout} className="checkout-button">Ir a Pagar</button>
    </div>
  );
};

export default Cart;
