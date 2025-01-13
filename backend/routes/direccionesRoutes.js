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
  const { usuario_id } = req;

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

    if (direccionPropietario === usuario_id || await esAdmin(usuario_id)) {
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
  const result = await pool.query(
    `SELECT rol FROM usuarios WHERE id_usuario = $1`,
    [usuario_id]
  );
  return result.rows[0]?.rol === 2;
};

module.exports = router;
