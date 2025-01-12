import React, { useState, useEffect } from "react";
import "../styles/addCategoria.css";
import axios from 'axios'; // Importa Axios
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';

function AddCategorias() {
  const id_categoria = sessionStorage.getItem("id_categoria");
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState(true);

  // Efecto para cargar la categoría al cargar el componente
  useEffect(() => {
    const obtenerCategoria = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/categorias/${id_categoria}`);
        // Verificar si la respuesta contiene una categoría
        if (response.data.categoria) {
          setNombreCategoria(response.data.categoria.nombre);
          setDescripcion(response.data.categoria.descripcion);
          setEstado(response.data.categoria.estado);
        }
      } catch (error) {
        console.error('Error al obtener categoria:', error);
        toast.error('Error al obtener la categoría.');
      }
    };

    obtenerCategoria();
  }, [id_categoria]);

  const handleUpdateCategoria = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("authToken"); // Asegúrate de que el token esté disponible
  
    try {
      const response = await axios.put(
        `http://localhost:5000/api/categorias/${id_categoria}`, 
        {
          nombre: nombreCategoria,
          descripcion: descripcion,
          estado: estado
        },
        {
          headers: {
                  'Authorization': `Bearer ${Cookies.get('authToken')}`,
                  'Content-Type': 'application/json',
          },
        }
      );
  
      toast.success('Categoría actualizada');
      console.log('Categoría actualizada:', response.data);
    } catch (error) {
      toast.error('Error al actualizar categoría');
      console.error('Error al actualizar categoría:', error);
    }
  };
  
  

  // Funciones para manejar los cambios de los campos
  const handleInputNombre = (e) => {
    setNombreCategoria(e.target.value);
  };

  const handleInputDescripcion = (e) => {
    setDescripcion(e.target.value);
  };

  return (
    <div className="contenedorAgregarProducto">
      <form onSubmit={handleUpdateCategoria}>
        <h1>ACTUALIZAR CATEGORÍA</h1>
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={nombreCategoria} 
          onChange={handleInputNombre}
          required
        />
        <textarea
          placeholder="Descripción"
          value={descripcion} 
          onChange={handleInputDescripcion}
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
        <button type="submit">Actualizar Categoría</button>
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
