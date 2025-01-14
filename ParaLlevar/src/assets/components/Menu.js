import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { CartContext } from './CartContext';
import Cart from './Cart'; 
import Header from './Header';
import '../styles/menu.css';

const Menu = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartVisible, setCartVisible] = useState(false);  
  const { cartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categorias/con-productos", {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`,
        },
      })
      .then((response) => {
        setCategorias(response.data);
        console.log(response.data)
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al cargar el menú. Por favor, inténtalo más tarde.");
        setLoading(false);
      });
  }, []);

  const toggleCart = () => {
    setCartVisible(!cartVisible); 
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="menu">
      <Header onCartClick={toggleCart} />
      
      {cartVisible && (
        <Cart
          cartItems={cartItems}
          onIncreaseQuantity={increaseQuantity}
          onDecreaseQuantity={decreaseQuantity}
          onRemoveItem={removeFromCart}
        />
      )}

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

                    {producto.oferta ? (
                      <>
                        <p className="producto-precio">
                          <span className="precio-original">
                            Precio: ${parseFloat(producto.precio).toFixed(2)}
                          </span>
                          <span className="precio-oferta">
                            Oferta: ${parseFloat(producto.precio - producto.oferta.descuento).toFixed(2)}
                          </span>
                        </p>
                        <p className="producto-oferta-tipo">
                          Oferta: {producto.oferta.tipo}
                        </p>
                        <p className="producto-oferta-fechas">
                          Válido desde {new Date(producto.oferta.fecha_inicio).toLocaleDateString()} hasta {new Date(producto.oferta.fecha_fin).toLocaleDateString()}
                        </p>
                      </>
                    ) : (
                      <p className="producto-precio">
                        Precio: ${parseFloat(producto.precio).toFixed(2)}
                      </p>
                    )}

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
