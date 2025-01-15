import React, { useState, useEffect } from 'react';
import '../styles/restaurante.css'
import Cookies from 'js-cookie';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


function HomeNegocio() {
  
  const [resenas, setResenas] = useState([]);
  const[productoMasVendido, setProductoMasVendido] = useState(false)
  useEffect(() => {
    const fetchResenas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pedidos/resultados/resenias', {
            headers: {
                Authorization: `Bearer ${Cookies.get('authToken')}`  
            }
        });
        setResenas(response.data); 
        console.log(response.data)
      } catch (error) {
        console.error('Error al obtener las reseñas:', error);
      }
    };

    fetchResenas();
  }, []);
  
  const [productData, setProductData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Total de Pedidos',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/productos')
      .then(response => {
        const productos = response.data;
        if (Array.isArray(productos)) {
          const nombres = productos.map(producto => producto.nombre);
          const totalPedidos = productos.map(producto => Number(producto.total_pedidos));
          console.log('Producto más vendido:', productos[0]);
          setProductData({
            labels: nombres,
            datasets: [
              {
                label: 'Total de Pedidos',
                data: totalPedidos,
                backgroundColor: 'rgba(224, 7, 7, 0.77)',
                borderColor: 'rgb(213, 92, 0)',
                borderWidth: 1,
              }
            ]
          });
          const maxPedidos = Math.max(...totalPedidos);
          const indexMasVendido = totalPedidos.indexOf(maxPedidos);
          setProductoMasVendido(productos[indexMasVendido]);
          console.log(indexMasVendido);
        } else {
          console.error('La respuesta no es un arreglo válido:', productos);
        }
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
      });
  }, []);

    return (
      <div className="RestauranteContainer">
      <div className='grafico'>
        <div className="chart-card">
          <h3 className="card-title">Total de Pedidos por Producto</h3>
          <div className="card-body">
            <Bar data={productData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
      <div className='producto-masVendido'>
        <h1>Producto más Vendido</h1>
        {productoMasVendido ? (
          <div className="producto-card">
            <img 
              src={`http://localhost:5000/${productoMasVendido.imagen_url}`} 
              alt={productoMasVendido.nombre} 
              className="producto-imagen"
              onError={(e) => {
                console.error('Error al cargar la imagen:', e);
              }}
            />
            <h2>{productoMasVendido.nombre}</h2>
            <p>Total Pedidos: {productoMasVendido.total_pedidos}</p>
          </div>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
      <div className="reviews-container">
      <h1>Reseñas</h1>
        {resenas.map((resena) => (
          !resena.is_deleted && (
            <div className="review-card" key={resena.id_reseña}>
              <h3>Calificación: {'⭐'.repeat(resena.calificacion)}</h3>
              <p>{resena.comentario}</p>
              <p><small>Fecha: {new Date(resena.fecha).toLocaleDateString()}</small></p>
            </div>
          )
        ))}
      </div>
      
    </div>
    );
    
  }
  
  export default HomeNegocio;