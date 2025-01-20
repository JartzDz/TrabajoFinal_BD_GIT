const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const router = express.Router();

// Usuario admin
router.post('/createAdminUser', async (req, res) => {
  const nombre = 'Admin User';
  const correo = 'admin@prueba.com';
  const contrasena = 'admin123'; 
  const telefono = '1234567890';
  const idTipoUsuario = 2; 

  try {
    const hashContrasena = await bcrypt.hash(contrasena, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contrasena, telefono, id_tipo_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, nombre, correo, id_tipo_usuario',
      [nombre, correo, hashContrasena, telefono, idTipoUsuario]
    );

    res.status(201).json({
      message: 'Usuario admin creado con éxito',
      usuario: result.rows[0], 
    });
  } catch (err) {
    console.error('Error al crear el usuario admin:', err);
    res.status(500).json({ error: 'Error al crear el usuario admin' });
  }
});

module.exports = router;
