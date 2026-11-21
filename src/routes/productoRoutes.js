// src/routes/productoRoutes.js
const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas de productos están protegidas (Error Card #2)
router.use(authMiddleware);

router.get('/', productoController.obtenerTodos);
router.get('/:id', productoController.obtenerPorId);
router.post('/', productoController.crear);
router.put('/:id', productoController.actualizar);
router.delete('/:id', productoController.eliminar);

module.exports = router;