import React, { useEffect, useState } from 'react';
import '../styles/productoCards.css';
import { CarouselProvider, Slider, Slide, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

const ProductosCards = ({ productos = [], nombreBoton, onBuyClick, cardStyle = {}, carruselId }) => {
  const [visibleSlides, setVisibleSlides] = useState(3);

  useEffect(() => {
    const updateVisibleSlides = () => {
      if (window.innerWidth <= 820) {
        setVisibleSlides(1);
      } else if (window.innerWidth <= 1024) {
        setVisibleSlides(2);
      } else {
        setVisibleSlides(3); 
      }
    };

    window.addEventListener('resize', updateVisibleSlides);
    updateVisibleSlides();

    return () => window.removeEventListener('resize', updateVisibleSlides);
  }, []);

  const mapFields = (producto) => {
    const precioOriginal = parseFloat(producto.precio);
    const precioConDescuento = producto.precioConDescuento 
      ? parseFloat(producto.precioConDescuento) 
      : precioOriginal;

    return {
      imagen: producto.imagen_url || producto.imagen,
      nombre: producto.nombre,
      precio: precioOriginal,
      precioConDescuento: precioConDescuento,
      tipoOferta: producto.descripcionOferta || null,
      descripcion: producto.descripcion,
      esOferta: producto.tipo === 'oferta'
    };
  };

  return (
    <div className='contenedorCardProducto'>
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={170}
        totalSlides={productos.length}
        visibleSlides={visibleSlides}
        step={1}
        infinite
        orientation={window.innerWidth <= 820 ? 'vertical' : 'horizontal'}
        className='carousel-container'
        id={carruselId}
      >
        <Slider>
          {productos.map((producto, index) => {
            const { 
              imagen, 
              nombre, 
              precio, 
              precioConDescuento, 
              tipoOferta, 
              descripcion,
              esOferta 
            } = mapFields(producto);

            return (
              <Slide index={index} key={index}>
                <div className='card' style={cardStyle}>
                  <div className='contenidoCard'>
                    {imagen && (
                      <div className='contenedorImagen'>
                        <img 
                          src={`http://localhost:5000/${imagen}`} 
                          alt={`${nombre} Logo`} 
                          className='producto-imagen' 
                        />
                      </div>
                    )}

                    <h3>{nombre}</h3>

                    <h3>
                      {esOferta ? (
                        <>
                          <div className="precio-container">
                            <span className="precio-original">${precio.toFixed(2)}</span>
                            <span className="precio-descuento">${precioConDescuento.toFixed(2)}</span>
                          </div>
                          {tipoOferta && <span className="oferta-valor">{tipoOferta}</span>}
                        </>
                      ) : (
                        <span>${precio.toFixed(2)}</span>
                      )}
                    </h3>

                    {descripcion && <p>{descripcion}</p>}

                    <button 
                      className='add-to-cart-button' 
                      onClick={() => onBuyClick(producto)}
                    >
                      {nombreBoton}
                    </button>
                  </div>
                </div>
              </Slide>
            );
          })}
        </Slider>
        <div className='carousel-controls'>
          <ButtonNext className={`carousel-next-${carruselId} carousel-next-hidden`}>
            Next
          </ButtonNext>
        </div>
      </CarouselProvider>
      <div className='card-more'>
        <button onClick={() => document.querySelector(`.carousel-next-${carruselId}`).click()}>
          VER MÁS
        </button>
      </div>
    </div>
  );
};

export default ProductosCards;
