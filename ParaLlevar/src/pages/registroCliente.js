import React, { useState } from "react";
import axios from 'axios';
import '../assets/styles/registroUsuario.css';
import burger from '../assets/images/burger.png';
import { FaCircleUser } from "react-icons/fa6";
import { MdAlternateEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom"; // Importa useNavigate

const RegistroCliente = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  // Maneja el cambio en los campos de entrada
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "telefono") setTelefono(value);
    if (name === "password") setPassword(value);
    if (name === "passwordConfirm") setPasswordConfirm(value);
  };

  // Maneja la sumisión del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene que el formulario se envíe de manera predeterminada

    // Validación simple para contraseñas
    if (password !== passwordConfirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    
    try {
      // Hacer solicitud al backend para registrar al usuario
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: name,
        email: email,
        password: password
      });

      // Limpiar los campos
      setName("");
      setEmail("");
      setTelefono("");
      setPassword("");
      setPasswordConfirm("");

      // Mostrar mensaje de éxito
      toast.success("Usuario registrado con éxito");

      // Redirigir al login
      setTimeout(() => {
        navigate("/Login");  // Redirige al login
      }, 2000);

    } catch (error) {
      // Manejar errores
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Error al registrar usuario");
      }
    }
  };

  return (
    <div className="containerRegistro">
      <button className="back-button" onClick={() => window.history.back()}>←</button>
      <div className="waves-background"></div>
      <div className="loginForm">
        <form onSubmit={handleSubmit}>
          <h1 className="titulo">Registro</h1>
          <div className="input-box2">
            <input
              placeholder="Nombre Completo"
              required
              name="name"
              value={name}  // Establece el valor de cada campo
              onChange={handleInputChange}
            />
            <FaCircleUser className="icon" />
          </div>
          <div className="input-box2">
            <input
              type="email"
              placeholder="Correo Electrónico"
              required
              name="email"
              value={email}
              onChange={handleInputChange}
            />
            <MdAlternateEmail className="icon" />
          </div>
          <div className="input-box2">
            <input
              placeholder="Teléfono"
              required
              name="telefono"
              value={telefono}
              onChange={handleInputChange}
            />
            <FaPhone className="icon" />
          </div>
          <div className="password-container">
            <div className="input-box2">
              <input
                type="password"
                placeholder="Contraseña"
                required
                name="password"
                value={password}
                onChange={handleInputChange}
              />
              <RiLockPasswordFill className="icon3" />
            </div>
            <div className="input-box2">
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                required
                name="passwordConfirm"
                value={passwordConfirm}
                onChange={handleInputChange}
              />
              <RiLockPasswordFill className="icon2" />
            </div>
          </div>
          <button type="submit" id="botonRegistro">Registrarse</button>
          <div className="new-account">
            <p>¿Ya tienes una cuenta? <a href="/Login">Inicia Sesión</a></p>
          </div>
        </form>
      </div>
      <div className="imagenLogin">
        <img src={burger} alt="Hamburguesa" className="imagen" />
      </div>
      <div className="footer2">
        <div className="textoFooter">
          Copyright © 2024 Para Llevar. All Rights Reserved.
        </div>
      </div>
      <ToastContainer
        closeButtonStyle={{
          fontSize: '10px',
          padding: '4px'
        }}
        style={{ width: '400px' }}
      />
    </div>
  );
};

export default RegistroCliente;
