const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db'); 
const router = express.Router();

// Endpoint para crear un usuario de prueba
router.post('/createTestUser', async (req, res) => {
  const username = 'testuser';
  const email = 'testuser@prueba.com';
  const password = '123456';

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashPassword]
    );

    res.status(201).json({ message: 'Usuario de prueba creado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el usuario de prueba' });
  }
});

module.exports = router;
