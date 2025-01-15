import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import '../styles/graficos.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductosPedidosChart = () => {
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
          const totalPedidos = productos.map(producto => Number(producto.total_pedidos)); // Asegura que sea un número

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
        } else {
          console.error('La respuesta no es un arreglo válido:', productos);
        }
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
      });
  }, []);

  return (
    <div className="card">
      <h3 className="card-title">Total de Pedidos por Producto</h3>
      <div className="card-body">
        <Bar data={productData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default ProductosPedidosChart;
