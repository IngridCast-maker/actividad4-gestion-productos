// src/controllers/productoController.js
const Producto = require('../models/Producto');

const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno' });
    }
};

const crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock } = req.body;
        const nuevoProducto = new Producto({ nombre, descripcion, precio, stock });
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno' });
    }
};

module.exports = { obtenerProductos, crearProducto };