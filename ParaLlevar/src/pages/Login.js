import React, { Component } from "react";
import '../assets/styles/login.css';
import { FaCircleUser } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";
import ensalada from '../assets/images/burger.png';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit(e);
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;
  
    if (!username || !password) {
      toast.error("Por favor, complete todos los campos.");
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: username,
        password: password
      });
  
      if (response.status === 200) {
        if (response.data.token && response.data.user && response.data.user.role) {
          console.log('Respuesta del backend:', response.data);

          Cookies.set('authToken', response.data.token);
          Cookies.set('role', response.data.user.role);
          toast.success('Inicio de sesión exitoso');
          
          setTimeout(() => {
            window.location.href = '/Inicio'; 
          }, 1000);
        } else {
          toast.error("Datos incompletos en la respuesta del servidor");
        }
      } else {
        toast.error("Credenciales Incorrectas");
      }
    } catch (error) {
      toast.error("Error al iniciar sesión");
      console.error('Error de inicio de sesión:', error);
    }
  };
  
  
  render() {
    return (
      <div className="containerLogin">
        <button className="back-button" onClick={() => window.history.back()}>←</button>
        <div className="waves-background"></div>
        <div className="loginForm">
          <form>
            <h1 className="para">Para</h1>
            <h1 className="llevar">Llevar</h1>
            <div className="input-box">
              <input
                type="email"
                placeholder="Correo Electrónico"
                required
                name="username"
                onChange={this.handleInputChange}
              />
              <FaCircleUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Contraseña"
                required
                name="password"
                onChange={this.handleInputChange}
                onKeyDown={this.handleEnterPress}
              />
              <RiLockPasswordFill className="icon" />
            </div>
            <div className="forgot-password">
              <a href="#">¿Olvidaste la Contraseña?</a>
            </div>
            <button type="button" onClick={this.handleSubmit}>Iniciar Sesión</button>
            <div className="new-account">
              <p>¿Eres nuevo aquí? <a href="/Registro">Crear cuenta</a></p>
            </div>
          </form>
        </div>
        <div className="imagenLogin">
          <img src={ensalada} alt="Hamburguesa" className="imagen" />
        </div>
        <div className="footer">
          <div className="footer2"></div>
          <div className="textoFooter">
            Copyright © 2024 Para Llevar. All Rights Reserved.
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
}
