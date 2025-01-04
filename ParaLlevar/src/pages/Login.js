import React, { Component } from "react";
import '../assets/styles/login.css';
import { FaCircleUser } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";
import ensalada from '../assets/images/burger.png';

export default class Login extends Component {
  

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
            <button onClick={this.handleSubmit}>Iniciar Sesión</button>
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
          
      </div>
    );
  }
}
