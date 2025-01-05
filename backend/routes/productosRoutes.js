const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });

// productosRoutes.js
router.post('/agregar', upload.single('imagen'), async (req, res) => {
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



// Ruta para obtener productos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos'); 
    res.json(result.rows); 
  } catch (err) {
    console.error('Error al obtener los productos:', err);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
