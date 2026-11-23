// src/routes/productoRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const productoController = require('../controllers/productoController');

router.get('/', authMiddleware, productoController.obtenerTodos);
router.get('/:id', authMiddleware, productoController.obtenerPorId);
router.post('/', authMiddleware, productoController.crear);
router.put('/:id', authMiddleware, productoController.actualizar);
router.delete('/:id', authMiddleware, productoController.eliminar);

module.exports = router;