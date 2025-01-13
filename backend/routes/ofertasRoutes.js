const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');

// Obtener todas las ofertas con sus tipos y productos asociados
router.get('/', verifyToken(), async (req, res) => {
    try {
        const result = await pool.query(`
           SELECT o.id_oferta, o.valor, o.fecha_inicio, o.fecha_fin, o.activo,
             t.descripcion AS tipo_oferta,
             p.id_producto, p.nombre
            FROM ofertas o
            JOIN tipos_oferta t ON o.id_tipo_oferta = t.id_tipo_oferta
            LEFT JOIN productos_ofertas po ON o.id_oferta = po.id_oferta
            LEFT JOIN productos p ON po.id_producto = p.id_producto;
        `);
        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron ofertas.' });
        }
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener las ofertas:', err.message);
        res.status(500).json({ error: 'Error del servidor', detalles: err.message });
    }
});

// Actualizar una oferta
router.put('/:id_oferta', verifyToken(2), async (req, res) => {
  const { id_oferta } = req.params;
  const { id_producto, id_tipo_oferta, valor, fecha_inicio, fecha_fin, activo } = req.body;

  // Validación de fechas
  if (new Date(fecha_inicio) > new Date(fecha_fin)) {
    return res.status(400).json({ message: 'La fecha de inicio no puede ser posterior a la fecha de fin' });
  }

  try {
    // Verificar si la oferta existe
    const result = await pool.query(
      'SELECT * FROM ofertas WHERE id_oferta = $1',
      [id_oferta]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Oferta no encontrada' });
    }

    // Actualizar la oferta en la base de datos
    const updateResult = await pool.query(
      `UPDATE ofertas SET 
        id_tipo_oferta = $1, 
        valor = $2, 
        fecha_inicio = $3, 
        fecha_fin = $4, 
        activo = $5 
      WHERE id_oferta = $6 
      RETURNING *`,
      [id_tipo_oferta, valor, fecha_inicio, fecha_fin, activo, id_oferta]
    );

    // Si la oferta no se actualizó
    if (updateResult.rows.length === 0) {
      return res.status(500).json({ message: 'Error al actualizar la oferta' });
    }

    res.status(200).json({
      message: 'Oferta actualizada correctamente',
      oferta: updateResult.rows[0],
    });
  } catch (err) {
    console.error('Error al actualizar la oferta:', err);
    res.status(500).json({ message: 'Error del servidor', detalles: err.message });
  }
});

// Obtener tipos de oferta con opción de filtrar por ID
router.get('/tipos/:id_tipo_oferta?', verifyToken(), async (req, res) => {
  const { id_tipo_oferta } = req.params;  // Obtén el id_tipo_oferta (puede ser undefined)

  try {
    let query = 'SELECT * FROM tipos_oferta';
    let params = [];

    if (id_tipo_oferta) {
      query += ' WHERE id_tipo_oferta = $1';  
      params = [id_tipo_oferta];
    }

    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: id_tipo_oferta ? 'Tipo de oferta no encontrado.' : 'No se encontraron tipos de oferta.' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener tipos de oferta:', err.message);
    res.status(500).json({ error: 'Error del servidor', detalles: err.message });
  }
});

// Agregar una nueva oferta
router.post('/agregar', verifyToken(2), async (req, res) => {
    const { id_producto, id_tipo_oferta, valor, fecha_inicio, fecha_fin } = req.body;

    if (new Date(fecha_inicio) > new Date(fecha_fin)) {
        return res.status(400).json({ message: 'La fecha de inicio no puede ser posterior a la fecha de fin' });
    }

    try {
        // Verificar si la oferta ya está asociada a este producto, excluyendo las relaciones eliminadas lógicamente
        const existingOffer = await pool.query(
            'SELECT * FROM productos_ofertas WHERE id_producto = $1 AND id_oferta IN (' +
            '  SELECT id_oferta FROM ofertas WHERE id_tipo_oferta = $2 AND is_deleted = FALSE' +  // Excluir ofertas eliminadas lógicamente
            ') AND is_deleted = FALSE',  // Excluir relaciones eliminadas lógicamente
            [id_producto, id_tipo_oferta]
        );

        if (existingOffer.rows.length > 0) {
            return res.status(400).json({ message: 'La oferta ya está asociada a este producto.' });
        }

        // Crear una nueva oferta
        const ofertaResult = await pool.query(
            'INSERT INTO ofertas (id_tipo_oferta, valor, fecha_inicio, fecha_fin, activo) VALUES ($1, $2, $3, $4, TRUE) RETURNING *',
            [id_tipo_oferta, valor, fecha_inicio, fecha_fin]
        );

        const oferta = ofertaResult.rows[0];

        // Asociar la oferta al producto
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

  
// Obtener ofertas activas para un producto (excluyendo las eliminadas)
router.get('/producto/:id_producto', verifyToken(), async (req, res) => {
  const { id_producto } = req.params;

  try {
      const result = await pool.query(
          'SELECT o.* FROM ofertas o ' +
          'JOIN productos_ofertas po ON o.id_oferta = po.id_oferta ' +
          'WHERE po.id_producto = $1 AND o.activo = TRUE AND o.is_deleted = FALSE AND po.is_deleted = FALSE',
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

  
// Eliminar una oferta, considerando su asociación con productos
router.delete('/eliminar', verifyToken(2), async (req, res) => {
  const { id_oferta } = req.body;

  try {
      const ofertaResult = await pool.query(
          'SELECT * FROM ofertas WHERE id_oferta = $1 AND is_deleted = FALSE',
          [id_oferta]
      );

      if (ofertaResult.rows.length === 0) {
          return res.status(404).json({ message: 'No se encontró la oferta activa para eliminar.' });
      }

      await pool.query(
          'UPDATE ofertas SET is_deleted = TRUE WHERE id_oferta = $1 RETURNING *',
          [id_oferta]
      );

      await pool.query(
          'UPDATE productos_ofertas SET is_deleted = TRUE WHERE id_oferta = $1',
          [id_oferta]
      );

      res.status(200).json({
          message: 'Oferta eliminada correctamente (eliminación lógica)',
      });
  } catch (err) {
      console.error('Error al eliminar la oferta:', err);
      res.status(500).json({ message: 'Error al eliminar la oferta' });
  }
});

// Obtener oferta por id
router.get('/:id_oferta', verifyToken(), async (req, res) => {
  const { id_oferta } = req.params;

  try {
      const result = await pool.query(`
        SELECT o.id_oferta, o.valor, o.fecha_inicio, o.fecha_fin, o.activo,
              t.id_tipo_oferta, t.descripcion AS tipo_oferta,
              p.id_producto, p.nombre
        FROM ofertas o
        JOIN tipos_oferta t ON o.id_tipo_oferta = t.id_tipo_oferta
        LEFT JOIN productos_ofertas po ON o.id_oferta = po.id_oferta
        LEFT JOIN productos p ON po.id_producto = p.id_producto
        WHERE o.id_oferta = $1;
      `, [id_oferta]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Oferta no encontrada.' });
      }

      res.json(result.rows[0]);
  } catch (err) {
      console.error('Error al obtener la oferta:', err.message);
      res.status(500).json({ message: 'Error del servidor', detalles: err.message });
  }
});


module.exports = router;