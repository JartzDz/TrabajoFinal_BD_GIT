import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table, Modal, Input } from 'antd';
import { BsTrash } from 'react-icons/bs';
import { FiEdit } from 'react-icons/fi';
import Cookies from 'js-cookie';
import "../styles/crud-product.css";
import buscar from "../images/buscar.png";

function AddOferta() {
  const [tiposOferta, setTiposOferta] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTipo, setEditingTipo] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 

  useEffect(() => {
    const fetchTiposOferta = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/ofertas/tipos');
        const data = await response.json();
        if (Array.isArray(data)) {
          setTiposOferta(data);
        } else {
          setTiposOferta([]);
        }
      } catch (error) {
        toast.error('Error al cargar tipos de oferta');
      }
    };
    fetchTiposOferta();
  }, []);

  const handleAddTipo = async () => {
    if (!descripcion) {
      toast.error('Por favor ingrese una descripción');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/ofertas/tipos/agregar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descripcion }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Tipo de oferta agregado');
        setTiposOferta([...tiposOferta, data]);
        setDescripcion('');
        setIsModalVisible(false);
      } else {
        toast.error(data.message || 'Error al agregar tipo de oferta');
      }
    } catch (error) {
      toast.error('Error al agregar tipo de oferta');
    }
    setIsSubmitting(false);
  };
  
  const handleEditTipo = async () => {
    if (!descripcion) {
      toast.error('Por favor ingrese una descripción');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/ofertas/tipos/${editingTipo.id_tipo_oferta}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descripcion }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Tipo de oferta actualizado');
        setTiposOferta(tiposOferta.map(tipo => tipo.id_tipo_oferta === editingTipo.id_tipo_oferta ? data : tipo));
        setDescripcion('');
        setIsModalVisible(false);
      } else {
        toast.error(data.message || 'Error al actualizar tipo de oferta');
      }
    } catch (error) {
      toast.error('Error al actualizar tipo de oferta');
    }
    setIsSubmitting(false);
  };
  
  const handleDeleteTipo = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/ofertas/tipos/eliminar`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_tipo_oferta: id }),
      });
      if (response.ok) {
        toast.success('Tipo de oferta eliminado');
        setTiposOferta(tiposOferta.filter(tipo => tipo.id_tipo_oferta !== id));
      } else {
        toast.error('Error al eliminar tipo de oferta');
      }
    } catch (error) {
      toast.error('Error al eliminar tipo de oferta');
    }
  };
  

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id_tipo_oferta',
      key: 'id_tipo_oferta',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <div>
          <button onClick={() => handleEdit(record)}><FiEdit size={20} /></button>
          <button onClick={() => handleDeleteTipo(record.id_tipo_oferta)}><BsTrash size={20} /></button>
        </div>
      ),
    },
  ];

  const handleEdit = (tipo) => {
    setEditingTipo(tipo);
    setDescripcion(tipo.descripcion);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setDescripcion('');
    setEditingTipo(null);
  };

  // Filtrar datos por el término de búsqueda
  const filteredData = tiposOferta.filter(tipo =>
    tipo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-crud-prod">
      <main className="crud-producto-container">
        <div className="crud-producto">
          <div className="BusquedaProducto">
            <img className="FotoBuscar" src={buscar} alt="Buscar" />
            <input
              type="text"
              className="TextoBusquedaProducto"
              placeholder="Buscar Tipo de Oferta"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="botonAgregarProducto"
            onClick={() => {
              setIsModalVisible(true);
              setEditingTipo(null);
              setDescripcion('');
            }}
          >
            Agregar Tipo Oferta
          </button>
        </div>
  
        <div className="tabla-productos-container">
          <Table columns={columns} dataSource={filteredData} />
        </div>
      </main>
  
      {isModalVisible && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h2>{editingTipo ? 'EDITAR TIPO OFERTA' : 'AGREGAR TIPO OFERTA'}</h2>
            <input
              type="text"
              className="modal-input"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del tipo de oferta"
            />
            <div className="modal-buttons">
              <button
                className="modal-button"
                onClick={editingTipo ? handleEditTipo : handleAddTipo}
                disabled={isSubmitting}
              >
                {editingTipo ? 'EDITAR' : 'AGREGAR'}
              </button>
              <button className="modal-button cancel" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
  
      <div className="waves-background2-prod"></div>
  
      <ToastContainer style={{ width: '400px' }} autoClose={2000} closeButton={false} />
    </div>
  );
  
  
}

export default AddOferta;
