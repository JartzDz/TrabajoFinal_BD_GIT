import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { CartContext } from './CartContext';
import '../styles/menu.css';

const Menu = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categorias/con-productos", {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`,
        },
      })
      .then((response) => {
        setCategorias(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al cargar el menú. Por favor, inténtalo más tarde.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="menu">
      {categorias.map((categoria) => (
        <div key={categoria.id_categoria} className="categoria">
          <h2 className="categoria-titulo">{categoria.nombre}</h2>
          {categoria.descripcion && <p className="categoria-descripcion">{categoria.descripcion}</p>}
          <div className="productos">
            {categoria.productos.length > 0 ? (
              categoria.productos.map((producto) => (
                <div key={producto.id_producto} className="producto-card">
                  <img
                    className="producto-imagen"
                    src={`http://localhost:5000/${producto.imagen_url.split("\\").join("/")}`}
                    alt={producto.nombre}
                  />
                  <div className="producto-info">
                    <h3 className="producto-nombre">{producto.nombre}</h3>
                    <p className="producto-descripcion">{producto.descripcion}</p>
                    <p className="producto-precio">
                      Precio: ${!isNaN(parseFloat(producto.precio)) ? parseFloat(producto.precio).toFixed(2) : "N/A"}
                    </p>
                    {!producto.disponible && <p className="producto-no-disponible">No disponible</p>}
                    {producto.disponible && (
                      <button className="btn-add-to-cart" onClick={() => addToCart(producto)}>
                        Añadir al carrito
                      </button>
                    )}
                  </div>
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
