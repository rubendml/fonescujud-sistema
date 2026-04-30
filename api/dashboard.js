import { getResumenGeneral } from '../backend/src/controllers/dashboardController.js';

export default async function handler(req, res) {
    try {
        await getResumenGeneral(req, res);
    } catch (error) {
        console.error('Error en dashboard:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}