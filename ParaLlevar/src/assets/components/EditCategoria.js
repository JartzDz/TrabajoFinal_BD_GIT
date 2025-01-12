import React, {useState, useEffect} from "react";
import "../styles/addCategoria.css";
import Cookies from 'js-cookie';
import axios from 'axios'; // Importa Axios
import { ToastContainer, toast } from 'react-toastify';

function AddCategorias() {
  const [imageSrc, setImageSrc] = useState(null);
  const [categoria, setCategoria] = useState([]);
  const id_categoria = sessionStorage.getItem("id_categoria");
  const idNegocio = Cookies.get('id');
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [subirImagen, setSubirImagen] = useState(null);
  const [estado, setEstado] = useState(true);


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSubirImagen(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
        const obtenerCategoria = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/categoria/${id_categoria}`);
                setCategoria(response.data.categoria);
                if(response.data.categoria){
                  setNombreCategoria(response.data.categoria.nombre_categoria);
                  setDescripcion(response.data.categoria.descripcion);
                  setEstado(response.data.categoria.habilitado);
                }
                if(response.data.categoria.imagen_categoria!=null){
                  setImageSrc(response.data.categoria.imagen_categoria);
                }
            } catch (error) {
                console.error('Error al obtener categoria:', error);
            }
        };

        obtenerCategoria();
  }, [idNegocio]); 


  const handleUpdateCategoria = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append('nombre_categoria', nombreCategoria);
      formData.append('descripcion', descripcion);
      formData.append('habilitado', estado);
      if(subirImagen != null) formData.append('imagen_categoria', subirImagen);
      const response = await axios.post(`http://localhost:8000/api/categorias/${id_categoria}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Guardado');
      console.log('Categoria actualizada:', response.data);
      // Aquí podrías manejar la respuesta como necesites (actualizar estado, mostrar mensaje de éxito, etc.)
    } catch (error) {
      toast.error('Error al editar.');
      console.error('Error al actualizar categoria:', error);
      // Aquí podrías manejar el error como necesites (mostrar mensaje de error, rollback de cambios, etc.)
    }
  };

  const handleInputNombre = (e) => {
    setNombreCategoria(e.target.value); // Actualizar la opción seleccionada
  };

  const handleInputDescripcion = (e) => {
    setDescripcion(e.target.value); // Actualizar la opción seleccionada
  };


  return (
    <div className="contenedorAgregarProducto">
      <form onSubmit={""}>
        <h1>AGREGAR CATEGORÍA</h1>
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={""}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={""}
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