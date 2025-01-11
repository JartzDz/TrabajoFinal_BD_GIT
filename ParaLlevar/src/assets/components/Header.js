import React, { useContext } from 'react';
import { MdOutlineFoodBank } from "react-icons/md";
import { AiOutlineShopping } from "react-icons/ai";
import { FaBars } from "react-icons/fa";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import '../styles/header.css';
import { CartContext } from './CartContext';

const Header = ({ onCartClick }) => {
  const { cartItems } = useContext(CartContext); 

  const authToken = Cookies.get('authToken');
  let userRole = '';
  if (authToken) {
    const decodedToken = jwtDecode(authToken);
    userRole = decodedToken.role; 
  }

  const handleLogOut = () => {
    sessionStorage.clear();
    Cookies.remove('authToken');
    Cookies.remove('usr');
    Cookies.remove('rol');
    window.location.href = '/';
  };

  return (
    <nav>
      <a href={userRole === 1 ? '/Inicio' : userRole === 2 ? '/Inicio' : '/'} className='logo'>
        <MdOutlineFoodBank className='iconLogo' />Para Llevar
      </a>
      <input type="checkbox" id="menuToggle" />
      <label htmlFor="menuToggle" className="icon">
        <FaBars className='iconMenu' />
      </label>
      <div className={`menu`}>
        <ul>
          {authToken && userRole === 1 && (
            <>
              <li><a href="/Inicio">Inicio</a></li>
              <li><a href="/HistorialReservas">Mis Pedidos</a></li>
              <li><a href="/MiPerfil">Mi Perfil</a></li>
              <li className="show-small"><a href="/Reserva">Bolsa de Compras</a></li>
              <li><button className='buttonIniciarSesion' onClick={handleLogOut}>Cerrar Sesión</button></li>
            </>
          )}
          {authToken && userRole === 2 && (
            <>
              <li><a href="/Inicio">Inicio</a></li>
              <li><a href="/RegistroCategoria">Categorías</a></li>
              <li><a href="/RegistroProductos">Productos</a></li>
              <li><button className='buttonIniciarSesion' onClick={handleLogOut}>Cerrar Sesión</button></li>
            </>
          )}
          {!authToken && (
            <>
              <li><a href="/Registro" className="no-underline"><button className='buttonRegistrarse'>Registrarse</button></a></li>
              <li><a href="/Login" className="no-underline"><button className='buttonIniciarSesion'>Iniciar Sesión</button></a></li>
            </>
          )}
        </ul>
      </div>
      
      {authToken && userRole === 1 && (
        <div className="cart-icon">
          <a className='logo' onClick={onCartClick}>
            <AiOutlineShopping className='iconOrders' />
            {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
          </a>
        </div>
      )}
    </nav>
  );
};

export default Header;
