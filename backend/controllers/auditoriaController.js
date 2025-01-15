const pool = require('../config/db');

// Función para registrar auditoría
const registrarAuditoria = async (accion, tabla, id_registro, usuario_id, detalles = '') => {
    try {
        await pool.query(`
            INSERT INTO auditorias (accion, tabla_afectada, id_registro, usuario_id, detalles)
            VALUES ($1, $2, $3, $4, $5)
        `, [accion, tabla, id_registro, usuario_id, detalles]);
    } catch (error) {
        console.error("Error al registrar auditoría:", error);
    }
};

module.exports = { registrarAuditoria };
