// src/controllers/productoController.js
const Producto = require('../models/Producto');

exports.obtenerTodos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno' });
    }
};

exports.obtenerPorId = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ error: 'No encontrado' });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

exports.crear = async (req, res) => {
    try {
        const producto = new Producto(req.body);
        await producto.save();
        res.status(201).json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

exports.actualizar = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

exports.eliminar = async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};