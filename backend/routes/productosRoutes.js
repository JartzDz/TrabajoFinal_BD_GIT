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
router.post('/agregar', verifyToken(2), upload.single('imagen'), async (req, res) => {
  const { nombre, descripcion, precio, esOferta, categoria } = req.body;  
  const imagen_url = req.file ? req.file.path : '';

  try {
    const result = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, imagen_url) VALUES ($1, $2, $3, $4) RETURNING id_producto',
      [nombre, descripcion, precio, imagen_url]
    );
    
    const idProducto = result.rows[0].id_producto;  

    await pool.query(
      'INSERT INTO productos_categorias (id_producto, id_categoria) VALUES ($1, $2)',
      [idProducto, categoria] 
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
    const result = await pool.query('SELECT * FROM productos WHERE is_deleted = FALSE'); 

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
router.delete('/eliminar/:id', verifyToken(2), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'UPDATE productos SET is_deleted = TRUE WHERE id_producto = $1 RETURNING *', [id]
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
    const result = await pool.query('SELECT * FROM productos WHERE id_producto = $1 AND is_deleted = FALSE', [id]);

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
router.put('/actualizar/:id', verifyToken(2), upload.single('imagen'), async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, categoria } = req.body; 
  let imagen_url = req.file ? req.file.path : null; 

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ message: 'El nombre del producto es obligatorio' });
  }

  try {
    // Verificar si existe el producto
    const productoExistente = await pool.query('SELECT * FROM productos WHERE id_producto = $1', [id]); 
    if (productoExistente.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (!imagen_url) {
      imagen_url = productoExistente.rows[0].imagen_url;
    }

    const result = await pool.query(
      'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, imagen_url = $4 WHERE id_producto = $5 RETURNING *',  
      [nombre.trim(), descripcion, precio, imagen_url, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Producto no encontrado al intentar actualizar' });
    }

    const categoriaExistente = await pool.query(
      'SELECT * FROM productos_categorias WHERE id_producto = $1 AND id_categoria = $2',
      [id, categoria]
    );

    // Si la relación ya existe, no es necesario insertarla nuevamente
    if (categoriaExistente.rows.length === 0) {
      await pool.query(
        'INSERT INTO productos_categorias (id_producto, id_categoria) VALUES ($1, $2)',
        [id, categoria]
      );
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

// Ruta para obtener ofertas con productos asociados
router.get('/productos/ofertas', verifyToken(), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id_producto, 
        p.nombre, 
        p.descripcion, 
        p.imagen_url, 
        p.precio,
        o.id_oferta, 
        o.valor AS oferta_valor, 
        o.fecha_inicio, 
        o.fecha_fin
      FROM productos p
      JOIN productos_ofertas po ON p.id_producto = po.id_producto
      JOIN ofertas o ON po.id_oferta = o.id_oferta
      WHERE o.activo = TRUE
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron productos con ofertas.' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos con ofertas:', err.message);
    res.status(500).json({ error: 'Error del servidor', detalles: err.message });
  }
});


// Ruta para obtener productos sin ofertas
router.get('/productos/sin-ofertas', verifyToken(), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM productos
      WHERE id_producto NOT IN (
        SELECT id_producto FROM productos_ofertas
      )
    `);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron productos sin ofertas.' });
    }
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos sin ofertas:', err.message);
    res.status(500).json({ error: 'Error del servidor', detalles: err.message });
  }
});


module.exports = router;
