const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');
const { registrarAuditoria } = require('../controllers/auditoriaController');
// Obtener todos los pedidos
router.get('/', verifyToken(), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ mensaje: 'Acceso no autorizado' });
    }

    const userId = req.user.id;
    const userRole = req.user.role; 
    let query = `
      SELECT p.id_pedido, p.total, p.fecha_pedido, u.nombre AS usuario, 
             e.descripcion AS estado, t.descripcion AS tipo_pago,
             json_agg(
               json_build_object(
                 'id_producto', dp.id_producto,
                 'cantidad', dp.cantidad,
                 'subtotal', dp.subtotal,
                 'producto', pr.nombre
               )
             ) AS productos
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      JOIN estados_pedido e ON p.id_estado = e.id_estado
      JOIN tipos_pago t ON p.id_tipo_pago = t.id_tipo_pago
      LEFT JOIN detalle_pedidos dp ON p.id_pedido = dp.id_pedido
      LEFT JOIN productos pr ON dp.id_producto = pr.id_producto
      WHERE p.is_deleted = FALSE
    `;

    if (userRole !== 2) {
      query += ` AND p.id_usuario = $1`;
    }

    query += ` GROUP BY p.id_pedido, u.nombre, e.descripcion, t.descripcion
               ORDER BY p.fecha_pedido DESC`;

    const result = userRole === 2 
      ? await pool.query(query)
      : await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron pedidos.' });
    }
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener los pedidos:', err.message);
    res.status(500).json({ error: 'Error del servidor', detalles: err.message });
  }
});

// Obtener un pedido específico por ID
router.get('/:id_pedido', verifyToken(), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ mensaje: 'Acceso no autorizado' });
    }

    const { id_pedido } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role; 

    let query = `
      SELECT p.id_pedido, p.total, p.fecha_pedido, u.nombre AS usuario, 
             e.descripcion AS estado, t.descripcion AS tipo_pago,
             json_agg(
               json_build_object(
                 'id_producto', dp.id_producto,
                 'cantidad', dp.cantidad,
                 'subtotal', dp.subtotal,
                 'producto', pr.nombre
               )
             ) AS productos
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      JOIN estados_pedido e ON p.id_estado = e.id_estado
      JOIN tipos_pago t ON p.id_tipo_pago = t.id_tipo_pago
      LEFT JOIN detalle_pedidos dp ON p.id_pedido = dp.id_pedido
      LEFT JOIN productos pr ON dp.id_producto = pr.id_producto
      WHERE p.id_pedido = $1 AND p.is_deleted = FALSE
    `;

    if (userRole !== 2) {
      query += ` AND p.id_usuario = $2`;
    }

    query += ` GROUP BY p.id_pedido, u.nombre, e.descripcion, t.descripcion`;

    const result = userRole === 2
      ? await pool.query(query, [id_pedido])
      : await pool.query(query, [id_pedido, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado o no tiene permisos para verlo.' });
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
      const id_pedido = result.rows[0].id_pedido; 
      res.status(201).json({
        message: 'Pedido creado correctamente',
        pedido: result.rows[0],
      });
      await registrarAuditoria(
        'INSERT',            
        'pedidos',        
        id_pedido,          
        id_usuario,         
        `Se agrega el pedido con id: ${id_pedido}` 
      );
    } catch (err) {
      console.error('Error al crear el pedido:', err);
      res.status(500).json({ message: 'Error al crear el pedido' });
    }
  });
  
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
  
  router.get('/resultados/resenias', verifyToken(2), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM resenias WHERE is_deleted = FALSE');
        
        // Verificar si se obtuvieron resultados
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No hay reseñas disponibles.' });
        }

        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
});

// Marcar un pedido como entregado
router.put('/entregar/:id_pedido', verifyToken(2), async (req, res) => {
  const { id_pedido } = req.params;
  const estadoEntregado = 4; 

  try {
    const result = await pool.query(
      'SELECT * FROM pedidos WHERE id_pedido = $1 AND is_deleted = FALSE',
      [id_pedido]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    const updateResult = await pool.query(
      `UPDATE pedidos SET id_estado = $1 WHERE id_pedido = $2 RETURNING *`,
      [estadoEntregado, id_pedido]
    );

    res.status(200).json({
      message: 'Pedido marcado como entregado correctamente',
      pedido: updateResult.rows[0],
    });
  } catch (err) {
    console.error('Error al marcar el pedido como entregado:', err);
    res.status(500).json({ message: 'Error al marcar el pedido como entregado', detalles: err.message });
  }
});

router.post('/resenias', verifyToken(1), async (req, res) => {
  const { id_usuario, id_pedido, calificacion, comentario } = req.body;
  
  console.log('ID Usuario recibido:', id_usuario);

  // Validación de campos
  if (!id_usuario || !id_pedido || !calificacion || !comentario) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const pedidoResult = await pool.query(
      'SELECT * FROM pedidos WHERE id_pedido = $1 AND is_deleted = FALSE',
      [id_pedido]
    );

    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado o ya eliminado.' });
    }

    const insertResult = await pool.query(
      'INSERT INTO resenias (id_usuario, id_pedido, calificacion, comentario) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_usuario, id_pedido, calificacion, comentario]
    );

    res.status(201).json({
      message: 'Reseña agregada correctamente.',
      resenia: insertResult.rows[0],
    });

  } catch (err) {
    console.error('Error al agregar la reseña:', err);
    res.status(500).json({ message: 'Error al agregar la reseña.', detalles: err.message });
  }
});

module.exports = router;
