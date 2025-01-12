const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');

// Ruta para crear una categoría (solo admin)
router.post('/agregar',verifyToken(2), async (req, res) => {
    const { nombre, descripcion, estado } = req.body;
  
    try {
      // Insertar nueva categoría en la base de datos
      const result = await pool.query(
        'INSERT INTO categorias (nombre, descripcion, estado) VALUES ($1, $2, $3) RETURNING *',
        [nombre, descripcion, estado]
      );
  
      const nuevaCategoria = result.rows[0];
  
      // Responder con la categoría creada
      res.status(201).json({
        message: 'Categoría creada exitosamente',
        categoria: nuevaCategoria
      });
    } catch (error) {
      console.error('Error al agregar categoría', error);
      res.status(500).json({
        message: 'Error al agregar categoría',
        error: error.message
      });
    }
  });
// Ruta para obtener las categorías

  router.get('/', verifyToken(), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categorias');
        res.status(200).json(result.rows); 
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({
            message: 'Error al obtener categorías',
            error: error.message
        });
    }
});

  
  module.exports = router;
