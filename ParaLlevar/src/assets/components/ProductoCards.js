import React, { useEffect, useState } from 'react';
import '../styles/productoCards.css';
import { CarouselProvider, Slider, Slide, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

const ProductosCards = ({ productos = [], nombreBoton, onBuyClick, cardStyle = {}, carruselId }) => {
  const [visibleSlides, setVisibleSlides] = useState(3);

  useEffect(() => {
    const updateVisibleSlides = () => {
      if (window.innerWidth <= 820) {
        setVisibleSlides(1); // 1 slide visible en pantallas pequeñas
      } else if (window.innerWidth <= 1024) {
        setVisibleSlides(2); // 2 slides visibles en pantallas medianas
      } else {
        setVisibleSlides(3); // 3 slides visibles en pantallas grandes
      }
    };

    window.addEventListener('resize', updateVisibleSlides);
    updateVisibleSlides(); // Asegurarse de que se ajuste correctamente en carga

    return () => window.removeEventListener('resize', updateVisibleSlides);
  }, []);

  const mapFields = (producto) => {
    return {
      imagen: producto.imagen_oferta || producto.imagen, // Imagen de oferta o imagen del producto
      nombre: producto.nombre_oferta || producto.nombre_producto, // Nombre de oferta o nombre de producto
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
        orientation={window.innerWidth <= 820 ? 'vertical' : 'horizontal'} // Carrusel vertical en pantallas pequeñas
        className='carousel-container'
        id={carruselId}
      >
        <Slider>
          {productos.map((producto, index) => {
            const { imagen, nombre } = mapFields(producto);
            return (
              <Slide index={index} key={index}>
                <div className='card' style={cardStyle}>
                  <h3>${producto.precio}</h3>
                  <div className='contenidoCard'>
                    <img src={`http://localhost:5000/${imagen}`} alt={`${nombre} Logo`} className='producto-imagen' />
                    <h3>{nombre}</h3>
                    <p>{producto.descripcion}</p>
                    <button onClick={() => onBuyClick(producto)}>{nombreBoton}</button>
                  </div>
                </div>
              </Slide>
            );
          })}
        </Slider>
        <div className='carousel-controls'>
          <ButtonNext className={`carousel-next-${carruselId} carousel-next-hidden`}>Next</ButtonNext>
        </div>
      </CarouselProvider>
      <div className='card-more'>
        <button onClick={() => document.querySelector(`.carousel-next-${carruselId}`).click()}>VER MÁS</button>
      </div>
    </div>
  );
};

export default ProductosCards;
