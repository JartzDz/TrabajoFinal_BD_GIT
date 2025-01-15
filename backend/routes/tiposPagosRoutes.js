const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', verifyToken(), async (req, res) => {
    try {
        const tiposPago = await pool.query('SELECT * FROM tipos_pago WHERE is_deleted = FALSE');
        res.status(200).json(tiposPago.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los tipos de pago' });
    }
});

module.exports = router;
