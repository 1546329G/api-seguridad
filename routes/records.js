import express from 'express';
import db from '../utils/db.js';

const router = express.Router();

// Endpoint para registrar la entrada o salida de un alumno
router.post('/alumno', async (req, res) => {
    const { tipo, id_usuario, nombre, dni_o_codigo, carrera } = req.body;

    if (!tipo || !id_usuario || !nombre || !dni_o_codigo) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios para el registro del alumno.' });
    }

    try {
        const [rows] = await db.execute('SELECT * FROM registros WHERE dni_o_codigo = ? AND hora_salida IS NULL', [dni_o_codigo]);

        if (rows.length > 0) {
            await db.execute('UPDATE registros SET hora_salida = CURRENT_TIMESTAMP() WHERE dni_o_codigo = ? AND hora_salida IS NULL', [dni_o_codigo]);
            return res.status(200).json({ success: true, message: 'Salida de alumno registrada correctamente.' });
        } else {
            await db.execute('INSERT INTO registros (tipo, id_usuario, nombre, dni_o_codigo, carrera) VALUES (?, ?, ?, ?, ?)', [tipo, id_usuario, nombre, dni_o_codigo, carrera]);
            return res.status(201).json({ success: true, message: 'Entrada de alumno registrada correctamente.' });
        }
    } catch (error) {
        console.error('Error al registrar alumno:', error);
        res.status(500).json({ success: false, message: 'Error del servidor al procesar el registro.' });
    }
});

// Endpoint para registrar un invitado manualmente
router.post('/invitado', async (req, res) => {
    const { tipo, nombre, dni_o_codigo } = req.body;

    if (!tipo || !nombre || !dni_o_codigo) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios para el registro del invitado.' });
    }

    try {
        await db.execute('INSERT INTO registros (tipo, nombre, dni_o_codigo) VALUES (?, ?, ?)', [tipo, nombre, dni_o_codigo]);
        return res.status(201).json({ success: true, message: 'Entrada de invitado registrada correctamente.' });
    } catch (error) {
        console.error('Error al registrar invitado:', error);
        res.status(500).json({ success: false, message: 'Error del servidor al procesar el registro.' });
    }
});

// Endpoint para obtener el historial de alumnos
router.get('/historial/alumnos', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM registros WHERE tipo = "alumno" ORDER BY hora_entrada DESC');
        res.status(200).json({ success: true, historial: rows });
    } catch (error) {
        console.error('Error al obtener historial de alumnos:', error);
        res.status(500).json({ success: false, message: 'Error del servidor al obtener el historial de alumnos.' });
    }
});

// Endpoint para obtener el historial de invitados
router.get('/historial/invitados', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM registros WHERE tipo = "invitado" ORDER BY hora_entrada DESC');
        res.status(200).json({ success: true, historial: rows });
    } catch (error) {
        console.error('Error al obtener historial de invitados:', error);
        res.status(500).json({ success: false, message: 'Error del servidor al obtener el historial de invitados.' });
    }
});

export default router;