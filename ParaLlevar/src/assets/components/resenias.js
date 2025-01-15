import React, { useEffect, useState } from 'react';
import '../styles/resenias.css';
import axios from 'axios';
import Cookies from 'js-cookie';

function Resenas() {
  const [resenas, setResenas] = useState([]);

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

  return (
    <div className="reviews-container">
      {resenas.map((resena) => (
        !resena.is_deleted && (
          <div className="card" key={resena.id_reseña}>
            <h3>Calificación: {'⭐'.repeat(resena.calificacion)}</h3>
            <p>{resena.comentario}</p>
            <p><small>Fecha: {new Date(resena.fecha).toLocaleDateString()}</small></p>
          </div>
        )
      ))}
    </div>
  );
}

export default Resenas;
