const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');


// Para guardar una nueva dirección (solo clientes)
router.post('/guardar-direccion', verifyToken(1), async (req, res) => {
    const { usuario_id, direccion, ciudad, provincia, pais, codigo_postal, tipo_direccion } = req.body;

  try {
    const newDireccion = await pool.query(
      `INSERT INTO direcciones (usuario_id, direccion, ciudad, provincia, pais, codigo_postal, tipo_direccion) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [usuario_id, direccion, ciudad, provincia, pais, codigo_postal, tipo_direccion]
    );
    res.status(201).json(newDireccion.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al guardar la dirección' });
  }
});

// Obtener todas las direcciones de un cliente
router.get('/:usuario_id', verifyToken(1), async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const direcciones = await pool.query(
      `SELECT * FROM direcciones WHERE usuario_id = $1`,
      [usuario_id]
    );
    res.status(200).json(direcciones.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener las direcciones' });
  }
});

// Eliminar una dirección (solo admin o el usuario propietario de la dirección)
router.delete('/eliminar-direccion/:id', verifyToken(1), async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.user.id; 

  try {
    // Verificar si la dirección pertenece al usuario
    const direccion = await pool.query(
      `SELECT * FROM direcciones WHERE id_direccion = $1`,
      [id]
    );

    if (direccion.rowCount === 0) {
      return res.status(404).json({ message: 'Dirección no encontrada' });
    }

    const direccionPropietario = direccion.rows[0].usuario_id;

    // Verificar si el usuario autenticado es el propietario o es admin
    const esAdminResult = await pool.query(
      `SELECT id_tipo_usuario FROM usuarios WHERE id_usuario = $1 AND is_deleted = FALSE`,
      [usuario_id]
    );

    const esAdmin = esAdminResult.rows[0]?.id_tipo_usuario === 2;

    if (direccionPropietario === usuario_id || esAdmin) {
      await pool.query(
        `DELETE FROM direcciones WHERE id_direccion = $1`,
        [id]
      );
      return res.status(200).json({ message: 'Dirección eliminada correctamente' });
    } else {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta dirección' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar la dirección' });
  }
});

const esAdmin = async (usuario_id) => {
  try {
    const result = await pool.query(
      `SELECT u.id_tipo_usuario, t.descripcion 
       FROM usuarios u 
       JOIN tipos_usuario t ON u.id_tipo_usuario = t.id_tipo_usuario 
       WHERE u.id_usuario = $1 AND u.is_deleted = FALSE`,
      [usuario_id]
    );
    
    return result.rows[0]?.id_tipo_usuario === 2;
    
  } catch (error) {
    console.error('Error al verificar si es admin:', error);
    return false;
  }
};


module.exports = router;
