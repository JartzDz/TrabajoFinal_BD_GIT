const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const verifyToken = require('../middlewares/authMiddleware');

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

// Ruta para obtener un producto por ID (accesible para todos)
router.get('/:id', verifyToken(), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }

    res.json(result.rows[0]); 
  } catch (err) {
    console.error('Error al obtener el producto:', err.message); 
    res.status(500).json({ error: 'Error del servidor', detalles: err.message }); 
  }
});

// Ruta para actualizar productos (solo admin)
router.put('/actualizar/:id', verifyToken('admin'), upload.single('imagen'), async (req, res) => {
  const { id } = req.params;
  const { nombreProducto, descripcion, precio, es_oferta } = req.body;
  let imagen = req.file ? req.file.path : null;

  if (!nombreProducto || nombreProducto.trim() === '') {
    return res.status(400).json({ message: 'El nombre del producto es obligatorio' });
  }

  try {
    if (!imagen) {
      // Obtener la imagen existente de la base de datos si no hay nueva imagen
      const productoExistente = await pool.query('SELECT imagen FROM productos WHERE id = $1', [id]);
      if (productoExistente.rows.length === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      imagen = productoExistente.rows[0].imagen;
    }

    const result = await pool.query(
      'UPDATE productos SET nombre_producto = $1, descripcion = $2, precio = $3, imagen = $4, es_oferta = $5 WHERE id = $6 RETURNING *',
      [nombreProducto.trim(), descripcion, precio, imagen, esOferta === 'true', id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({
      message: 'Producto actualizado correctamente',
      producto: result.rows[0],
    });
  } catch (err) {
    console.error('Error al actualizar el producto:', err);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
});



module.exports = router;
