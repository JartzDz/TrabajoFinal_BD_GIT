import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../styles/addProduct.css';
import Cookies from 'js-cookie';

function AddOferta() {
  const [productos, setProductos] = useState([]);
  const [tiposOferta, setTiposOferta] = useState([]);
  const [valor, setValor] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [tipoOfertaSeleccionado, setTipoOfertaSeleccionado] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar productos y tipos de oferta al montar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/productos');
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    const fetchTiposOferta = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/ofertas/tipos');
        const data = await response.json();
        console.log('Tipos de oferta:', data);
    
        if (Array.isArray(data)) {
          setTiposOferta(data);
        } else {
          console.error('La respuesta no es un arreglo:', data);
          setTiposOferta([]);
        }
      } catch (error) {
        console.error('Error al cargar tipos de oferta:', error);
        setTiposOferta([]);  
      }
    };
    
    fetchProductos();
    fetchTiposOferta();
  }, []);
  const validarFechas = () => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const hoy = new Date();
  
    hoy.setHours(0, 0, 0, 0);
    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
  
    if (inicio < hoy) {
      toast.error('La fecha de inicio no puede ser anterior a hoy');
      return false;
    }
  
    if (fin <= inicio) {
      toast.error('La fecha de fin debe ser posterior a la fecha de inicio');
      return false;
    }
  
    return true;
  };

  const validarValor = () => {
    if (parseFloat(valor) <= 0 || isNaN(valor)) {
      toast.error('El valor de la oferta debe ser un número positivo.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Verificar si el tipo de oferta está seleccionado
    if (!tipoOfertaSeleccionado) {
      toast.error('Por favor, selecciona un tipo de oferta');
      return;
    }
  
    if (!validarValor() || !validarFechas()) {
      return;
    }
  
    const ofertaData = {
      id_producto: parseInt(productoSeleccionado, 10),
      id_tipo_oferta: parseInt(tipoOfertaSeleccionado, 10),
      valor: parseFloat(valor),
      fecha_inicio: new Date(fechaInicio).toISOString(),
      fecha_fin: new Date(fechaFin).toISOString(),
    };

    console.log(ofertaData);
    try {
     const response = await fetch('http://localhost:5000/api/ofertas/agregar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`,
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(ofertaData),      

     });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success('Oferta agregada exitosamente!');
        setProductoSeleccionado('');
        setTipoOfertaSeleccionado('');
        setValor('');
        setFechaInicio('');
        setFechaFin('');
      } else {
        toast.error(data.message || 'Error al agregar la oferta');
      }
    } catch (error) {
      console.error('Error al agregar la oferta:', error);
      toast.error('Error al conectar con el servidor');
    }
  };
  
  
  return (
    <div className="contenedorAgregarProducto">
      <form onSubmit={handleSubmit}>
        <h1>AGREGAR OFERTA</h1>
        <select
          id="producto"
          name="id_producto"
          value={productoSeleccionado}
          onChange={(e) => setProductoSeleccionado(e.target.value)}
          required
        >
          <option value="" disabled>Selecciona un producto</option>
          {productos.map((producto) => (
            <option key={producto.id_producto} value={producto.id_producto}>
              {producto.nombre}
            </option>
          ))}
        </select>

        <select
          id="tipoOferta"
          name="id_tipo_oferta"
          value={tipoOfertaSeleccionado}
          onChange={(e) => setTipoOfertaSeleccionado(e.target.value)}
          required
        >
          <option value="" disabled>Selecciona una oferta</option>
          {tiposOferta.map((tipo) => (
            <option key={tipo.id_tipo_oferta} value={tipo.id_tipo_oferta}>
              {tipo.descripcion}
            </option>
          ))}
        </select>

        <input
          type="number"
          id="valor"
          name="valor"
          step="0.01"
          placeholder="Valor de la Oferta"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />

        <input
          type="date"
          id="fechaInicio"
          name="fecha_inicio"
          min={new Date().toISOString().split('T')[0]}
          placeholder="Fecha de Inicio"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          required
        />

        <input
          type="date"
          id="fechaFin"
          name="fecha_fin"
          min={fechaInicio || new Date().toISOString().split('T')[0]}
          placeholder="Fecha de Fin"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Agregar Oferta'}
        </button>
      </form>

      <ToastContainer
        style={{ width: '400px' }}
        autoClose={2000}
        closeButton={false}
      />
    </div>
  );
}

export default AddOferta;
