import React, { useState } from "react";
import "../styles/addCategoria.css";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios'; // Importa Axios
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddCategorias({ onAgregarCategoria }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();  

    // Validar que los campos no estén vacíos
    if (!nombre || !descripcion) {
      toast.error('Por favor, complete todos los campos');
      return;
    }

    try {
      const token = Cookies.get('authToken');

      const response = await axios.post('http://localhost:5000/api/categorias', {
          nombre,
          descripcion,
          estado
        },
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );

      toast.success(response.data.message);  // Mostrar mensaje de éxito
      onAgregarCategoria(response.data.categoria);  // Llamar a la función para agregar la categoría
      navigate('/categorias');  // Redirigir a la lista de categorías
    } catch (error) {
      console.error('Error al agregar categoría', error);
      toast.error('Error al agregar la categoría');  // Mostrar mensaje de error
    }
  };

  return (
    <div className="contenedorAgregarProducto">
      <form onSubmit={handleSubmit}>
        <h1>AGREGAR CATEGORÍA</h1>
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <div className="offerSwitch">
          <label>{estado ? 'Activo' : 'Inactivo'}</label>
          <input
            type="checkbox"
            checked={estado}
            onChange={(e) => setEstado(e.target.checked)}
          />
        </div>
        <button type="submit">Agregar Categoría</button>
      </form>
      <ToastContainer
        style={{ width: '400px' }} 
        autoClose={2000}
        closeButton={false}
      />
    </div>
  );
}

export default AddCategorias;
