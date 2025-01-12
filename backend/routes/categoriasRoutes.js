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

// Ruta para eliminar una categoría (solo admin)
router.delete('/:id', verifyToken(2), async (req, res) => {
    const { id } = req.params;
    console.log(`Intentando eliminar categoría con ID: ${id}`);

    try {
        const result = await pool.query(
            'DELETE FROM categorias WHERE id_categoria = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            message: 'Categoría eliminada exitosamente',
            categoria: result.rows[0]
        });
    } catch (error) {
        console.error('Error al eliminar categoría', error);
        res.status(500).json({
            message: 'Error al eliminar categoría',
            error: error.message
        });
    }
});

// Ruta para obtener una categoría por ID
router.get('/:id', verifyToken(), async (req, res) => {
    const { id } = req.params; // Obtiene el ID de los parámetros de la URL
    try {
      const result = await pool.query('SELECT * FROM categorias WHERE id_categoria = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Categoría no encontrada'
        });
      }
  
      res.status(200).json({
        categoria: result.rows[0]  
      });
    } catch (error) {
      console.error('Error al obtener la categoría:', error);
      res.status(500).json({
        message: 'Error al obtener la categoría',
        error: error.message
      });
    }
  });
  
  // Ruta para actualizar una categoría (solo admin)
router.put('/:id', verifyToken(2), async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;
  
    try {
      const result = await pool.query('SELECT * FROM categorias WHERE id_categoria = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Categoría no encontrada'
        });
      }
      const updateResult = await pool.query(
        'UPDATE categorias SET nombre = $1, descripcion = $2, estado = $3 WHERE id_categoria = $4 RETURNING *',
        [nombre, descripcion, estado, id]
      );
  
      res.status(200).json({
        message: 'Categoría actualizada exitosamente',
        categoria: updateResult.rows[0]
      });
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      res.status(500).json({
        message: 'Error al actualizar categoría',
        error: error.message
      });
    }
  });

 module.exports = router;
