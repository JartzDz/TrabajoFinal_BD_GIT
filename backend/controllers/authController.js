const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Función de registro
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar si el correo ya existe
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    // Si el usuario ya existe, retornar un error
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // Encriptar la contraseña
    const hashPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashPassword]
    );

    const user = result.rows[0];

    // Crear el token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error('Error en el registro:', err);

    if (err.code === '23505') { 
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    res.status(500).json({ error: 'Error interno del servidor. Inténtalo más tarde.' });
  }
};


// Función de login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por correo
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    // Comparar las contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // Crear el token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Responder con los datos del usuario y el token
    res.json({
      message: 'Inicio de sesión exitoso',
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el login' });
  }
};

module.exports = { registerUser, loginUser };
