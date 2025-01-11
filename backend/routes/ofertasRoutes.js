const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');

// Obtener todos los tipos de oferta
router.get('/tipos', verifyToken(), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tipos_oferta');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron tipos de oferta.' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener los tipos de oferta:', err.message);
    res.status(500).json({ error: 'Error del servidor', detalles: err.message });
  }
});

// Agregar una nueva oferta
router.post('/agregar', verifyToken(2), async (req, res) => {
    const { id_producto, id_tipo_oferta, valor, fecha_inicio, fecha_fin } = req.body;
    console.log("Aqui",req.body); 

    if (new Date(fecha_inicio) > new Date(fecha_fin)) {
      return res.status(400).json({ message: 'La fecha de inicio no puede ser posterior a la fecha de fin' });
    }
  
    try {
      const existingOffer = await pool.query(
        'SELECT * FROM productos_ofertas WHERE id_producto = $1 AND id_oferta IN (SELECT id_oferta FROM ofertas WHERE id_tipo_oferta = $2)',
        [id_producto, id_tipo_oferta]
      );
  
      if (existingOffer.rows.length > 0) {
        return res.status(400).json({ message: 'La oferta ya está asociada a este producto.' });
      }
  
      const ofertaResult = await pool.query(
        'INSERT INTO ofertas (id_tipo_oferta, valor, fecha_inicio, fecha_fin, activo) VALUES ($1, $2, $3, $4, TRUE) RETURNING *',
        [id_tipo_oferta, valor, fecha_inicio, fecha_fin]
      );
  
      const oferta = ofertaResult.rows[0];
  
      await pool.query(
        'INSERT INTO productos_ofertas (id_producto, id_oferta) VALUES ($1, $2)',
        [id_producto, oferta.id_oferta]
      );
  
      res.status(201).json({
        message: 'Oferta agregada correctamente al producto',
        oferta,
      });
    } catch (err) {
      console.error('Error al agregar la oferta:', err);
      res.status(500).json({ message: 'Error al agregar la oferta' });
    }
  });
  
  // Obtener ofertas por producto
  router.get('/producto/:id_producto', verifyToken(), async (req, res) => {
    const { id_producto } = req.params;
  
    try {
      const result = await pool.query(
        'SELECT o.* FROM ofertas o JOIN productos_ofertas po ON o.id_oferta = po.id_oferta WHERE po.id_producto = $1 AND o.activo = TRUE',
        [id_producto]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No se encontraron ofertas activas para este producto.' });
      }
  
      res.json(result.rows);
    } catch (err) {
      console.error('Error al obtener ofertas del producto:', err.message);
      res.status(500).json({ message: 'Error al obtener ofertas' });
    }
  });
  
  // Eliminar una oferta
  router.delete('/eliminar', verifyToken(2), async (req, res) => {
    const { id_producto, id_oferta } = req.body;
  
    try {
      const result = await pool.query(
        'DELETE FROM productos_ofertas WHERE id_producto = $1 AND id_oferta = $2 RETURNING *',
        [id_producto, id_oferta]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'No se encontró la oferta para eliminar.' });
      }
  
      res.status(200).json({
        message: 'Oferta eliminada correctamente del producto',
        ofertaEliminada: result.rows[0],
      });
    } catch (err) {
      console.error('Error al eliminar la oferta:', err);
      res.status(500).json({ message: 'Error al eliminar la oferta' });
    }
  });
  

module.exports = router;