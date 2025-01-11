const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_usuario, nombre, correo, telefono, id_tipo_usuario FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener los usuarios:', err);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

// Obtener un solo usuario por ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  // Validar que el id es un número entero
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    return res.status(400).json({ error: 'ID de usuario no válido' });
  }

  try {
    const result = await pool.query('SELECT id_usuario, nombre, correo, telefono, id_tipo_usuario FROM usuarios WHERE id_usuario = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener el usuario:', err);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};


const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { nombre, contrasena } = req.body;

  try {
    const userResult = await pool.query('SELECT id_usuario FROM usuarios WHERE id_usuario = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    let updateQuery = 'UPDATE usuarios SET ';
    const values = [];
    let counter = 1;

    // Solo actualiza si se envían los campos
    if (nombre) {
      updateQuery += `nombre = $${counter}, `;
      values.push(nombre);
      counter++;
    }
    if (contrasena) {
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      updateQuery += `contrasena = $${counter}, `;
      values.push(hashedPassword);
      counter++;
    }

    if (values.length === 0) {
      return res.status(400).json({ error: 'No se ha proporcionado ningún campo para actualizar' });
    }

    updateQuery = updateQuery.slice(0, -2);  // Elimina la última coma
    updateQuery += ` WHERE id_usuario = $${counter} RETURNING id_usuario, nombre, id_tipo_usuario;`;

    values.push(id);

    const updatedResult = await pool.query(updateQuery, values);
    res.json({ message: 'Perfil actualizado con éxito', user: updatedResult.rows[0] });
  } catch (err) {
    console.error('Error al actualizar el perfil:', err);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
};



module.exports = { getAllUsers, getUserById, updateUserById };
