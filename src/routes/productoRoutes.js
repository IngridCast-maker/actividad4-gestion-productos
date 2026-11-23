// src/routes/productoRoutes.js
const express = require('express');
const router = express.Router();
const { obtenerProductos, crearProducto } = require('../controllers/productoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, obtenerProductos);
router.post('/', authMiddleware, crearProducto);

module.exports = router;