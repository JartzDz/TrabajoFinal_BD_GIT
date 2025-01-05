import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FormularioProducto() {
  const [nombreProducto, setNombreProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagenArchivo, setImagen] = useState(null);
  const [nombreImagen, setNombreImagen] = useState('');

  const handleImageChange = (e) => {
    setImagen(e.target.files[0]);
    setNombreImagen(e.target.files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('nombreProducto', nombreProducto);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('imagen', imagenArchivo);
    formData.append('esOferta', false);
  
    try {
      const response = await fetch('http://localhost:5000/api/productos/agregar', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        toast.success('Producto agregado con éxito');
  
        setNombreProducto('');
        setDescripcion('');
        setPrecio('');
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
          value={nombreProducto}
          onChange={(e) => setNombreProducto(e.target.value)}
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
                     closeButtonStyle={{
                         fontSize: '12px', 
                         padding: '4px'    
                         }}
              style={{ width: '400px' }} 
              autoClose={2000}
        />
    </div>
  );
}

export default FormularioProducto;
