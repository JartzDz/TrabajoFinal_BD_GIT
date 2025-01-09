const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const verifyToken = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });

// Ruta para agregar productos (solo admin)
router.post('/agregar', verifyToken('admin'), upload.single('imagen'), async (req, res) => {
  const { nombreProducto, descripcion, precio, esOferta } = req.body;
  const imagen = req.file ? req.file.path : '';
  
  try {
    const result = await pool.query(
      'INSERT INTO productos (nombre_producto, descripcion, precio, imagen, es_oferta) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombreProducto, descripcion, precio, imagen, esOferta === 'true']
    );
    
    res.status(201).json({
      message: 'Producto agregado correctamente',
      producto: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al agregar el producto' });
  }
});



// Ruta para obtener productos (accesible para todos)
router.get('/', verifyToken(), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos'); 

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron productos.' });
    }

    res.json(result.rows); 
  } catch (err) {
    console.error('Error al obtener los productos:', err.message); 
    res.status(500).json({ error: 'Error del servidor', detalles: err.message }); 
  }
});

// Ruta para eliminar productos (solo admin)
router.delete('/eliminar/:id', verifyToken('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM productos WHERE id = $1 RETURNING *', [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto eliminado', producto: result.rows[0] });
  } catch (err) {
    console.error('Error al eliminar el producto:', err);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
});

module.exports = router;
