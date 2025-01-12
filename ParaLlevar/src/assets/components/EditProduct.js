import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "../styles/addProduct.css";

function EditProduct() {
  const id_producto = sessionStorage.getItem("id_producto");
  const [subirImagen, setSubirImagen] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [nombreProducto, setNombreProducto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [esOferta, setEsOferta] = useState(false);
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [nombreImagen, setNombreImagen] = useState("");

  const navigate = useNavigate();

  // Cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categorias", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategorias(data);
        } else {
          toast.error("Error al obtener categorías");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error de conexión al cargar categorías");
      }
    };
    fetchCategorias();
  }, []);

  // Obtener producto para editar
  useEffect(() => {
    const obtenerProducto = async () => {
      if (!id_producto) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/productos/${id_producto}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });

        const productoData = response.data;

        if (productoData) {
          setNombreProducto(productoData.nombre || "");
          setDescripcion(productoData.descripcion || "");
          setPrecio(productoData.precio || "");
          setCategoria(productoData.categoria || "");

          if (productoData.imagen_url) {
            setImageSrc(`http://localhost:5000/${productoData.imagen_url.split("\\").join("/")}`);
          }
        }
      } catch (error) {
        console.error("Error al obtener producto:", error);
      }
    };

    obtenerProducto();
  }, [id_producto]);

  // Manejo de cambio de imagen
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSubirImagen(file);
      setNombreImagen(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Actualizar producto
  const handleUpdateProducto = async (e) => {
    e.preventDefault();

    if (!nombreProducto || nombreProducto.trim() === "") {
      toast.error("El nombre del producto es obligatorio");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nombre", nombreProducto.trim());
      formData.append("descripcion", descripcion?.trim() || "");
      formData.append("precio", precio || "0");
      formData.append("categoria", categoria);

      if (subirImagen) {
        formData.append("imagen", subirImagen);
      }

      const response = await axios.put(
        `http://localhost:5000/api/productos/actualizar/${id_producto}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        }
      );

      toast.success("Producto actualizado exitosamente");

      setNombreProducto("");
      setDescripcion("");
      setPrecio("");
      setEsOferta(false);
      setSubirImagen(null);
      setImageSrc(null);
      setCategoria("");

      setTimeout(() => {
        navigate("/registroProductos");
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      toast.error("Error al actualizar el producto");
    }
  };

  return (
    <div className="contenedorAgregarProducto">
      <form onSubmit={handleUpdateProducto}>
        <h1>EDITAR PRODUCTO</h1>
        <input
          type="text"
          placeholder="Nombre del Producto"
          value={nombreProducto}
          onChange={(e) => setNombreProducto(e.target.value)}
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>
          {categorias.map((categoria) => (
            <option key={categoria.id_categoria} value={categoria.id_categoria}>
              {categoria.nombre}
            </option>
          ))}
        </select>
       
        <input
          type="file"
          id="file-upload"
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: "none" }}
        />
        <label htmlFor="file-upload" className="file-upload-label">
          Subir imagen
        </label>
        {nombreImagen && <p>Imagen seleccionada: {nombreImagen}</p>}
        {imageSrc && <img src={imageSrc} alt="Vista previa" className="producto-imagen" />}
        <button type="submit">Actualizar Producto</button>
      </form>

      <ToastContainer style={{ width: "400px" }} autoClose={2000} closeButton={false} />
    </div>
  );
}

export default EditProduct;
