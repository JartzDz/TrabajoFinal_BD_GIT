import React, { useState, useEffect } from "react";
import "../styles/addProduct.css";
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function AddProduct() {
  const id_producto = sessionStorage.getItem("id_producto");
  const [subirImagen, setSubirImagen] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [nombreProducto, setNombreProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [esOferta, setEsOferta] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      setSubirImagen(file);
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const obtenerProducto = async () => {
      if (!id_producto) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/productos/${id_producto}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('authToken')}`,
          },
        });

        const productoData = response.data;
        console.log('Datos recibidos del producto:', productoData);
        
        if (productoData) {
          setNombreProducto(productoData.nombre_producto || '');
          setDescripcion(productoData.descripcion || '');
          setCategoria(productoData.id_categoria || '');
          setPrecio(productoData.precio || '');
          setEsOferta(productoData.es_oferta || false);

          if (productoData.imagen) {
            setImageSrc(`http://localhost:5000/${productoData.imagen.split('\\').join('/')}`);
          }
        }
      } catch (error) {
        console.error('Error al obtener producto:', error);
      }
    };

    obtenerProducto();
  }, [id_producto]);

  const handleUpdateProducto = async (e) => {
    e.preventDefault();
    
    if (!nombreProducto || nombreProducto.trim() === '') {
      toast.error('El nombre del producto es obligatorio');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nombreProducto', nombreProducto.trim());
      formData.append('descripcion', descripcion?.trim() || '');
      formData.append('precio', precio || '0');
      formData.append('esOferta', esOferta);

      if (categoria) {
        formData.append('id_categoria', categoria);
      }

      // Solo anexamos una nueva imagen si se seleccionó una nueva
      if (subirImagen) {
        formData.append('imagen', subirImagen);
      }

      console.log('--- Contenido del FormData ---');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await axios.put(
        `http://localhost:5000/api/productos/actualizar/${id_producto}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('authToken')}`,
          }
        }
      );

      console.log('Respuesta del servidor:', response.data);
      toast.success('Producto actualizado exitosamente');
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      toast.error('Error al actualizar el producto');
    }
  };

  return (
    <div className="contenedorAgregarProducto">
      <form>
        <h1>EDITAR PRODUCTO</h1>
        <input
          type="text"
          placeholder="Nombre del Producto"
          value={nombreProducto}
          onChange={(e) => {
            console.log('Nuevo valor del nombre:', e.target.value);
            setNombreProducto(e.target.value);
          }}
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Selecciona una categoría</option>
          <option value="entrada">Entrada</option>
          <option value="postre">Postre</option>
          <option value="plato fuerte">Plato Fuerte</option>
        </select>
        
        <div className="offerSwitch">
          <label htmlFor="esOferta">¿Está en oferta?</label>
          <input
            type="checkbox"
            id="esOferta"
            checked={esOferta}
            onChange={(e) => setEsOferta(e.target.checked)}
          />
        </div>

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
      </form>

      <div className="imagen-addProduct">
        <div className="imagen">
          <label>Imagen del Producto</label>
          <div className="image-preview-container">
            {imageSrc ? (
              <img src={imageSrc} alt="Producto" className="producto-imagen" />
            ) : (
              <div className="image-placeholder">Vista previa de la imagen</div>
            )}
          </div>
          
          <button 
            className="btn_editarProducto" 
            onClick={handleUpdateProducto}
          >
            Actualizar Producto
          </button>
        </div>
      </div>

      <ToastContainer
        closeButtonStyle={{
          fontSize: '12px',
          padding: '4px',
        }}
        autoClose={2000}
        closeButton={false}
        style={{ width: '400px' }}
      />
    </div>
  );
}

export default AddProduct;
