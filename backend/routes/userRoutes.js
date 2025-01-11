const express = require('express');
const { getAllUsers, getUserById, updateUserById } = require('../controllers/userController');
const router = express.Router();

// Ruta para obtener todos los usuarios
router.get('/', getAllUsers);

// Ruta para obtener un solo usuario por ID
router.get('/:id', getUserById);

// Ruta para actualizar un usuario por ID (nombre, correo, teléfono y contraseña)
router.put('/:id', updateUserById);

module.exports = router;
