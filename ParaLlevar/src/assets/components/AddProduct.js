import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../styles/addProduct.css';

function FormularioProducto() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagenArchivo, setImagen] = useState(null);
  const [nombreImagen, setNombreImagen] = useState('');
  const [categorias, setCategorias] = useState([]);

  const navigate = useNavigate();

  // Función para cargar las categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categorias', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${Cookies.get('authToken')}`,  // Asegúrate de incluir el token de autenticación
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategorias(data);  // Almacenar las categorías en el estado
        } else {
          toast.error('Error al obtener categorías');
        }
      } catch (error) {
        console.error(error);
        toast.error('Error de conexión al cargar categorías');
      }
    };

    fetchCategorias();
  }, []);  // El arreglo vacío [] asegura que solo se ejecute una vez al cargar el componente

  const handleImageChange = (e) => {
    setImagen(e.target.files[0]);
    setNombreImagen(e.target.files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('categoria', categoria);
    formData.append('imagen', imagenArchivo);

    try {
      const response = await fetch('http://localhost:5000/api/productos/agregar', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`, 
        },
      });

      if (response.ok) {
        toast.success('Producto agregado con éxito');
        setTimeout(() => {
          navigate('/registroProductos');
        }, 2000);
        setNombre('');
        setDescripcion('');
        setPrecio('');
        setCategoria('');
        setImagen(null);
        setNombreImagen('');
      } else {
        toast.error('Error al agregar el producto');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión');
    }
  };

  return (
    <div className="contenedorAgregarProducto">
      <form onSubmit={handleSubmit}>
        <h1>AGREGAR PRODUCTO</h1>
        <input
          type="text"
          placeholder="Nombre del Producto"
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
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        >
          <option value="" disabled>Selecciona una categoría</option>
          {categorias.map(categoria => (
            <option key={categoria.id_categoria} value={categoria.id_categoria}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        <input
          type="file"
          id="file-upload"
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload" className="file-upload-label">
          Subir imagen
        </label>
        {nombreImagen && <p>Imagen seleccionada: {nombreImagen}</p>}
        <button type="submit">Agregar Producto</button>
      </form>
      <ToastContainer
        style={{ width: '400px' }} 
        autoClose={2000}
        closeButton={false}
      />
    </div>
  );
}

export default FormularioProducto;
