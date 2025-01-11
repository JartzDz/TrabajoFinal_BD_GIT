import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/mi-perfil.css';
import { ToastContainer, toast } from 'react-toastify';

function MiPerfil() {
    const [nombre, setNombre] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [originalNombre, setOriginalNombre] = useState(''); 
    const [originalPassword, setOriginalPassword] = useState('******');
    const [isEditable, setIsEditable] = useState(false);
    const [compras, setCompras] = useState(0);  
    const [userId, setUserId] = useState(null);

    const handleCuadroClick = (cuadro) => {
        // Aquí no necesitamos manejar la selección de "ofertas" ya que solo mostramos compras
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            const authToken = Cookies.get('authToken'); // Primero obtenemos el authToken
            if (!authToken) {
                console.error('No se encontró el authToken');
                return;
            }

            try {
                const decodedToken = JSON.parse(atob(authToken.split('.')[1])); 
                const userId = decodedToken.id;  
                setUserId(decodedToken.id);
                const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                const user = response.data;
                setNombre(user.nombre);
                setOriginalNombre(user.nombre); 
                setPassword('******');
                setOriginalPassword('******'); 
    
                const responseCompras = await axios.get(`http://localhost:8000/api/ventasCliente`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                const ventas = responseCompras.data.ventas;
                let totalNormal = 0;  
                ventas.forEach(venta => {
                    if (venta.tipo_producto === 'Normal') {
                        totalNormal += venta.cantidad;
                    }
                });
                setCompras(totalNormal); 
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
    
        fetchUserProfile();
    }, []);

    const handleNombreChange = (event) => {
        setNombre(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleActualizarPerfilClick = async () => {
        const authToken = Cookies.get('authToken');
        if (!authToken) {
            toast.error('No se encontró el authToken');
            return;
        }
    
        if (isEditable) {
            try {
                const formData = {};

                if (nombre !== originalNombre) formData.nombre = nombre;
                if (password !== '******' && password !== originalPassword) formData.contrasena = password;
    
                if (Object.keys(formData).length === 0) {
                    toast.error('No se han realizado cambios');
                    return;
                }

                const response = await axios.put(`http://localhost:5000/api/users/${userId}`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                toast.success('Perfil actualizado correctamente');
                setOriginalNombre(nombre);
                setOriginalPassword(password);
                setIsEditable(false);
            } catch (error) {
                toast.error('Error al actualizar el perfil');
                console.error('Error updating profile:', error);
            }
        } else {
            setIsEditable(true);
        }
    };
    
    return (
        <div className="main-container-perfil">
            <main className="perfil-container">
                <div className="perfil-formulario">
                    <header className="header-perfil">
                        <h1>Mi Perfil</h1>
                    </header>
                    <div className="perfil-campos">
                        <div className="perfil-campo">
                            <label htmlFor="nombre">Nombre(s)</label>
                            <input 
                                type="text" 
                                id="nombre" 
                                name="nombre" 
                                className="campo-input" 
                                value={nombre}
                                onChange={handleNombreChange}
                                disabled={!isEditable} 
                            />
                        </div>
                        <div className="perfil-campo">
                            <label htmlFor="password">Contraseña</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                className="campo-input" 
                                value={password}
                                onChange={handlePasswordChange}
                                disabled={!isEditable} 
                            />
                        </div>
                        <button 
                            className="btn_actualizarPerfil" 
                            onClick={handleActualizarPerfilClick}
                        >
                            {isEditable ? 'Guardar Cambios' : 'Actualizar Perfil'}
                        </button>
                        {isEditable && (
                            <button 
                                className="btn_cancelarPerfil" 
                                onClick={() => {
                                    setNombre(originalNombre);
                                    setPassword('******');
                                    setIsEditable(false);
                                }}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                    <div className="perfil-cuadros">
                        <div
                            className={`perfil-cuadro ${'compras' === 'compras' ? 'selected' : ''}`}
                        >
                            <h2>Compras</h2>
                            <p>{compras}</p>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="contenedorFooter-perfil">
                <div className="textoFooter2">
                    Copyright © 2024 Para Llevar. All Rights Reserved.
                </div>
            </footer>
            <ToastContainer closeButtonStyle={{ fontSize: '12px', padding: '4px' }} style={{ width: '400px' }} />
            <div className="waves-background2-perfil"></div>
        </div>
    );
}

export default MiPerfil;
