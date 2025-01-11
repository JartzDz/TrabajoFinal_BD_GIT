import React, { useState } from 'react';
import { MdOutlineFoodBank } from "react-icons/md";
import { AiOutlineShopping } from "react-icons/ai";
import { FaBars } from "react-icons/fa";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import '../styles/header.css';

const Header = ({ cartCount, onCartClick }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const authToken = Cookies.get('authToken');

  let userRole = '';
  if (authToken) {
    const decodedToken = jwtDecode(authToken);
    userRole = decodedToken.role; 
  }
  
  const handleToggleMenu = () => setShowMenu(!showMenu);
  const handleToggleSubMenu = () => setShowSubMenu(!showSubMenu);

  const handleLogOut = () => {
    sessionStorage.clear();
    Cookies.remove('authToken');
    Cookies.remove('usr');
    Cookies.remove('rol');
    window.location.href = '/';
  };

  return (
    <nav>
      <a href={userRole === 'cliente' ? '/Inicio' : userRole === 'admin' ? '/Inicio' : '/'} className='logo'>
        <MdOutlineFoodBank className='iconLogo' />Para Llevar
      </a>
      <input type="checkbox" id="menuToggle" checked={showMenu} onChange={handleToggleMenu} />
      <label htmlFor="menuToggle" className="icon">
        <FaBars className='iconMenu' />
      </label>
      <div className={`menu ${showMenu ? 'show' : ''}`}>
        <ul>
          {authToken && userRole === 'cliente' && (
            <>
              <li><a href="/Inicio">Inicio</a></li>
              <li><a href="/HistorialReservas">Mis Pedidos</a></li>
              <li><a href="/MiPerfil">Mi Perfil</a></li>
              <li className="show-small"><a href="/Reserva">Bolsa de Compras</a></li>
              <li><button className='buttonIniciarSesion' onClick={handleLogOut}>Cerrar Sesión</button></li>
            </>
          )}
          {authToken && userRole === 'admin' && (
            <>
              <li><a href="/Inicio">Inicio</a></li>
              <li><a href="/RegistroCategoria">Categorías</a></li>
              <li><a href="/RegistroProductos">Productos</a></li>
              <li className="reservas-menu">
                <a onClick={handleToggleSubMenu}>Pedidos</a>
                {showSubMenu && (
                  <div className="submenu">
                    <ul>
                      <li><a href="/ReservasRecibidas">Recibidos</a></li>
                      <li><a href="/ReservasEnProceso">En Proceso</a></li>
                      <li><a href="/ReservasListas">Listas para Entregar</a></li>
                      <li><a href="/ReservasHistorial">Historial</a></li>
                    </ul>
                  </div>
                )}
              </li>
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
      
      {authToken && userRole === 'cliente' && (
        <div className="cart-icon">
          <a className='logo' onClick={onCartClick}>
            <AiOutlineShopping className='iconOrders' />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </a>
        </div>
      )}
    </nav>
  );
};

export default Header;
