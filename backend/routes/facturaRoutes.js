const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');

// Ruta para crear una nueva factura
router.post('/', async (req, res) => {
    const { id_pedido, numero_factura, fecha_emision, subtotal, iva, total, razon_social, ruc_cedula, direccion_facturacion } = req.body;
  
    try {
      const result = await pool.query(
        'INSERT INTO factura (id_pedido, numero_factura, fecha_emision, subtotal, iva, total, razon_social, ruc_cedula, direccion_facturacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_factura',
        [id_pedido, numero_factura, fecha_emision, subtotal, iva, total, razon_social, ruc_cedula, direccion_facturacion]
      );
  
      const facturaId = result.rows[0].id_factura;
      res.status(201).json({ id_factura: facturaId, mensaje: 'Factura creada con éxito' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ mensaje: 'Error al crear la factura' });
    }
  });
  
  // Ruta para obtener todas las facturas
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM factura');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ mensaje: 'Error al obtener las facturas' });
    }
  });
  
  // Ruta para obtener una factura por ID
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('SELECT * FROM factura WHERE id_factura = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ mensaje: 'Factura no encontrada' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ mensaje: 'Error al obtener la factura' });
    }
  });
  
  // Ruta para actualizar una factura
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { numero_factura, fecha_emision, subtotal, iva, total, razon_social, ruc_cedula, direccion_facturacion } = req.body;
  
    try {
      const result = await pool.query(
        'UPDATE factura SET numero_factura = $1, fecha_emision = $2, subtotal = $3, iva = $4, total = $5, razon_social = $6, ruc_cedula = $7, direccion_facturacion = $8 WHERE id_factura = $9 RETURNING *',
        [numero_factura, fecha_emision, subtotal, iva, total, razon_social, ruc_cedula, direccion_facturacion, id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ mensaje: 'Factura no encontrada' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ mensaje: 'Error al actualizar la factura' });
    }
  });
  
  // Ruta para eliminar una factura
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('DELETE FROM factura WHERE id_factura = $1 RETURNING *', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ mensaje: 'Factura no encontrada' });
      }
  
      res.status(200).json({ mensaje: 'Factura eliminada con éxito' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ mensaje: 'Error al eliminar la factura' });
    }
  });
  
  // Agregar los detalles de la factura
  router.post('/detalle', async (req, res) => {
    const { id_factura, id_producto, cantidad, precio_unitario, subtotal } = req.body;
  
    try {
      await pool.query(
        'INSERT INTO detalle_factura (id_factura, id_producto, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
        [id_factura, id_producto, cantidad, precio_unitario, subtotal]
      );
      res.status(201).json({ mensaje: 'Detalle de factura agregado con éxito' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ mensaje: 'Error al agregar el detalle de factura' });
    }
  });
  
  // Ruta para obtener los detalles de una factura
  router.get('detalle/:id_factura', async (req, res) => {
    const { id_factura } = req.params;
  
    try {
      const result = await pool.query(
        'SELECT df.*, p.nombre_producto FROM detalle_factura df JOIN productos p ON df.id_producto = p.id_producto WHERE df.id_factura = $1',
        [id_factura]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ mensaje: 'Detalles no encontrados para esta factura' });
      }
  
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ mensaje: 'Error al obtener los detalles de la factura' });
    }
  });
  
  router.delete('detalle/:id_factura/:id_producto', async (req, res) => {
    const { id_factura, id_producto } = req.params;
  
    try {
      const result = await pool.query(
        'DELETE FROM detalle_factura WHERE id_factura = $1 AND id_producto = $2 RETURNING *',
        [id_factura, id_producto]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ mensaje: 'Detalle no encontrado' });
      }
  
      res.status(200).json({ mensaje: 'Detalle de factura eliminado con éxito' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ mensaje: 'Error al eliminar el detalle de factura' });
    }
  });

  module.exports = router;
