const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');

// Obtener todos los pedidos
router.get('/', verifyToken(), async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT p.id_pedido, p.total, p.fecha_pedido, u.nombre AS usuario, 
               e.descripcion AS estado, t.descripcion AS tipo_pago
        FROM pedidos p
        JOIN usuarios u ON p.id_usuario = u.id_usuario
        JOIN estados_pedido e ON p.id_estado = e.id_estado
        JOIN tipos_pago t ON p.id_tipo_pago = t.id_tipo_pago
        WHERE p.is_deleted = FALSE;
      `);
      if (result.rows.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron pedidos.' });
      }
      res.json(result.rows);
    } catch (err) {
      console.error('Error al obtener los pedidos:', err.message);
      res.status(500).json({ error: 'Error del servidor', detalles: err.message });
    }
  });

// Obtener un pedido por ID
router.get('/:id_pedido', verifyToken(), async (req, res) => {
    const { id_pedido } = req.params;
  
    try {
      const result = await pool.query(`
        SELECT p.id_pedido, p.total, p.fecha_pedido, u.nombre AS usuario, 
               e.descripcion AS estado, t.descripcion AS tipo_pago
        FROM pedidos p
        JOIN usuarios u ON p.id_usuario = u.id_usuario
        JOIN estados_pedido e ON p.id_estado = e.id_estado
        JOIN tipos_pago t ON p.id_tipo_pago = t.id_tipo_pago
        WHERE p.id_pedido = $1 AND p.is_deleted = FALSE;
      `, [id_pedido]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ mensaje: 'Pedido no encontrado.' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error al obtener el pedido:', err.message);
      res.status(500).json({ error: 'Error del servidor', detalles: err.message });
    }
  });

// Crear un nuevo pedido
router.post('/agregar', verifyToken(), async (req, res) => {
    const { id_usuario, id_estado, id_tipo_pago, total, direccion_envio } = req.body;
  
    try {
      const result = await pool.query(
        'INSERT INTO pedidos (id_usuario, id_estado, id_tipo_pago, total, direccion_envio) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [id_usuario, id_estado, id_tipo_pago, total, direccion_envio]
      );
      res.status(201).json({
        message: 'Pedido creado correctamente',
        pedido: result.rows[0],
      });
    } catch (err) {
      console.error('Error al crear el pedido:', err);
      res.status(500).json({ message: 'Error al crear el pedido' });
    }
  });
  
// Actualizar un pedido
router.put('/:id_pedido', verifyToken(2), async (req, res) => {
    const { id_pedido } = req.params;
    const { id_estado, id_tipo_pago, total, direccion_envio } = req.body;
  
    try {
      const result = await pool.query(
        'SELECT * FROM pedidos WHERE id_pedido = $1 AND is_deleted = FALSE',
        [id_pedido]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
  
      const updateResult = await pool.query(
        `UPDATE pedidos SET 
          id_estado = $1, 
          id_tipo_pago = $2, 
          total = $3, 
          direccion_envio = $4 
        WHERE id_pedido = $5 
        RETURNING *`,
        [id_estado, id_tipo_pago, total, direccion_envio, id_pedido]
      );
  
      res.status(200).json({
        message: 'Pedido actualizado correctamente',
        pedido: updateResult.rows[0],
      });
    } catch (err) {
      console.error('Error al actualizar el pedido:', err);
      res.status(500).json({ message: 'Error al actualizar el pedido', detalles: err.message });
    }
  });
  
// Eliminar un pedido
router.delete('/eliminar', verifyToken(2), async (req, res) => {
    const { id_pedido } = req.body;
  
    try {
      const result = await pool.query(
        'SELECT * FROM pedidos WHERE id_pedido = $1 AND is_deleted = FALSE',
        [id_pedido]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
  
      await pool.query(
        'UPDATE pedidos SET is_deleted = TRUE WHERE id_pedido = $1',
        [id_pedido]
      );
  
      res.status(200).json({ message: 'Pedido eliminado correctamente' });
    } catch (err) {
      console.error('Error al eliminar el pedido:', err);
      res.status(500).json({ message: 'Error al eliminar el pedido' });
    }
  });
  
// Agregar un detalle de pedido
router.post('/detalle', verifyToken(), async (req, res) => {
    const { id_pedido, id_producto, cantidad, subtotal } = req.body;
  
    try {
      const result = await pool.query(
        'INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, subtotal) VALUES ($1, $2, $3, $4) RETURNING *',
        [id_pedido, id_producto, cantidad, subtotal]
      );
      res.status(201).json({
        message: 'Detalle de pedido agregado correctamente',
        detalle: result.rows[0],
      });
    } catch (err) {
      console.error('Error al agregar el detalle de pedido:', err);
      res.status(500).json({ message: 'Error al agregar el detalle de pedido' });
    }
  });
  
// Actualizar un detalle de pedido
router.put('/detalle/:id_pedido/:id_producto', verifyToken(2), async (req, res) => {
    const { id_pedido, id_producto } = req.params;
    const { cantidad, subtotal } = req.body;
  
    try {
      const result = await pool.query(
        'SELECT * FROM detalle_pedidos WHERE id_pedido = $1 AND id_producto = $2 AND is_deleted = FALSE',
        [id_pedido, id_producto]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Detalle de pedido no encontrado' });
      }
  
      const updateResult = await pool.query(
        `UPDATE detalle_pedidos SET 
          cantidad = $1, 
          subtotal = $2 
        WHERE id_pedido = $3 AND id_producto = $4 
        RETURNING *`,
        [cantidad, subtotal, id_pedido, id_producto]
      );
  
      res.status(200).json({
        message: 'Detalle de pedido actualizado correctamente',
        detalle: updateResult.rows[0],
      });
    } catch (err) {
      console.error('Error al actualizar el detalle de pedido:', err);
      res.status(500).json({ message: 'Error al actualizar el detalle de pedido', detalles: err.message });
    }
  });
  
// Eliminar un detalle de pedido
router.delete('/detalle/eliminar', verifyToken(2), async (req, res) => {
    const { id_pedido, id_producto } = req.body;
  
    try {
      const result = await pool.query(
        'SELECT * FROM detalle_pedidos WHERE id_pedido = $1 AND id_producto = $2 AND is_deleted = FALSE',
        [id_pedido, id_producto]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Detalle de pedido no encontrado' });
      }
  
      await pool.query(
        'UPDATE detalle_pedidos SET is_deleted = TRUE WHERE id_pedido = $1 AND id_producto = $2',
        [id_pedido, id_producto]
      );
  
      res.status(200).json({ message: 'Detalle de pedido eliminado correctamente' });
    } catch (err) {
      console.error('Error al eliminar el detalle de pedido:', err);
      res.status(500).json({ message: 'Error al eliminar el detalle de pedido' });
    }
  });
  
  module.exports = router;
