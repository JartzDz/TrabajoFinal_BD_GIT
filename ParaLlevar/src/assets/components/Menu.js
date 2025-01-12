import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Asumimos que usarás Axios para las solicitudes HTTP

const Menu = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cambia esta URL por tu endpoint real
    axios.get('/api/categorias-con-productos')
      .then(response => {
        setCategorias(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error al cargar el menú. Por favor, inténtalo más tarde.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="menu">
      {categorias.map(categoria => (
        <div key={categoria.id_categoria} className="categoria">
          <h2>{categoria.nombre}</h2>
          {categoria.descripcion && <p>{categoria.descripcion}</p>}
          <div className="productos">
            {categoria.productos.length > 0 ? (
              categoria.productos.map(producto => (
                <div key={producto.id_producto} className="producto">
                  <img src={producto.imagen_url} alt={producto.nombre} />
                  <h3>{producto.nombre}</h3>
                  <p>{producto.descripcion}</p>
                  <p>Precio: ${producto.precio.toFixed(2)}</p>
                  {!producto.disponible && <p style={{ color: 'red' }}>No disponible</p>}
                </div>
              ))
            ) : (
              <p>No hay productos disponibles en esta categoría.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
