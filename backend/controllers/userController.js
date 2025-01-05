const pool = require('../config/db');

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener los usuarios:', err);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

module.exports = { getAllUsers };
