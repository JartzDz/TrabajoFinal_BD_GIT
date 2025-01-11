const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Función de registro
const registerUser = async (req, res) => {
  const { nombre, correo, contrasena, telefono, id_tipo_usuario = 1 } = req.body;

  try {
    // Validar el correo con una expresión regular
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ error: 'El correo electrónico tiene una estructura inválida.' });
    }

    // Validar el teléfono (debe tener exactamente 10 dígitos)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(telefono)) {
      return res.status(400).json({ error: 'El número de teléfono debe tener exactamente 10 dígitos.' });
    }

    // Verificar si el correo ya existe
    const existingUser = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // Verificar si el teléfono ya está registrado
    const existingPhone = await pool.query('SELECT * FROM usuarios WHERE telefono = $1', [telefono]);
    if (existingPhone.rows.length > 0) {
      return res.status(400).json({ error: 'El teléfono ya está registrado.' });
    }

    // Encriptar la contraseña
    const hashPassword = await bcrypt.hash(contrasena, 10);
    
    // Insertar el nuevo usuario en la base de datos
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contrasena, telefono, id_tipo_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, nombre, correo, telefono, id_tipo_usuario',
      [nombre, correo, hashPassword, telefono, id_tipo_usuario]
    );

    const user = result.rows[0];

    // Crear el token JWT
    const token = jwt.sign({ id: user.id_usuario, role: user.id_tipo_usuario }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: { id: user.id_usuario, nombre: user.nombre, correo: user.correo, telefono: user.telefono, id_tipo_usuario: user.id_tipo_usuario },
      token,
    });

  } catch (err) {
    console.error('Error en el registro:', err);
    res.status(500).json({ error: 'Error interno del servidor. Inténtalo más tarde.' });
  }
};

// Función de login
const loginUser = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    // Verificar si el usuario existe
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // Crear el token JWT
    const token = jwt.sign({ id: user.id_usuario, role: user.id_tipo_usuario }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Establecer la cookie de sesión
    res.cookie('id', user.id_usuario, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', 
      maxAge: 3600000, 
    });

    res.json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
        telefono: user.telefono,
        id_tipo_usuario: user.id_tipo_usuario,
      },
      token,
    });
    
  } catch (err) {
    console.error('Error en el login:', err);
    res.status(500).json({ error: 'Error interno del servidor. Inténtalo más tarde.' });
  }
};

module.exports = { registerUser, loginUser };
