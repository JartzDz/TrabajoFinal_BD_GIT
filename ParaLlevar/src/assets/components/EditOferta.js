import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

function EditOferta() {
  const id_oferta = sessionStorage.getItem("id_oferta");
  const [productos, setProductos] = useState([]);
  const [tiposOferta, setTiposOferta] = useState([]);
  const [valor, setValor] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [tipoOfertaSeleccionado, setTipoOfertaSeleccionado] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        const response = await fetch('http://localhost:5000/api/ofertas/tipos'); // Cargar todos los tipos de oferta
        if (!response.ok) {
          throw new Error('No se pudo cargar los tipos de oferta');
        }
  
        const data = await response.json();
        setTiposOferta(data); // Establecer todos los tipos de oferta
        console.log('Tipos de oferta:', data); 
      } catch (error) {
        console.error('Error al cargar tipos de oferta:', error);
      }
    };
  
    const fetchOferta = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/ofertas/${id_oferta}`);
        const data = await response.json();
        console.log("Datos recibidos:", data);
        
        if (data) {
          setProductoSeleccionado(data.id_producto);
          setTipoOfertaSeleccionado(data.id_tipo_oferta); // Aquí se establece el tipo de oferta para que esté seleccionado
          setValor(data.valor);
          
          if (data.fecha_inicio) {
            const fechaInicio = new Date(data.fecha_inicio).toISOString().split('T')[0];
            setFechaInicio(fechaInicio);
          }
          
          if (data.fecha_fin) {
            const fechaFin = new Date(data.fecha_fin).toISOString().split('T')[0];
            setFechaFin(fechaFin);
          }
        }
      } catch (error) {
        console.error('Error al cargar la oferta:', error);
        toast.error('Error al cargar la oferta');
      }
    };
  
    fetchProductos();
    fetchTiposOferta(); 
    if (id_oferta) {
      fetchOferta(); 
    }
  }, [id_oferta]); 
  

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
      const response = await fetch(`http://localhost:5000/api/ofertas/${id_oferta}`, {
        method: 'PUT', 
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ofertaData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Oferta actualizada exitosamente!');
        setProductoSeleccionado('');
        setTipoOfertaSeleccionado('');
        setValor('');
        setFechaInicio('');
        setFechaFin('');
      } else {
        toast.error(data.message || 'Error al actualizar la oferta');
      }
    } catch (error) {
      console.error('Error al actualizar la oferta:', error);
      toast.error('Error al conectar con el servidor');
    }
  };

  return (
    <div className="contenedorAgregarProducto">
      <form onSubmit={handleSubmit}>
        <h1>EDITAR OFERTA</h1>
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
          {isSubmitting ? 'Guardando...' : 'Actualizar Oferta'}
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

export default EditOferta;
