// src/controllers/productoController.js
const Producto = require('../models/Producto');

// GET /productos - Obtener todos
exports.obtenerTodos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// GET /productos/:id - Obtener uno por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

// POST /productos - Crear (Error Card #8: validación de datos)
exports.crear = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock } = req.body;

        if (!nombre || !descripcion || precio === undefined) {
            return res.status(400).json({ error: 'Nombre, descripción y precio son requeridos' });
        }

        if (precio < 0) {
            return res.status(400).json({ error: 'El precio no puede ser negativo' });
        }

        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            precio,
            stock: stock || 0
        });

        await nuevoProducto.save();
        res.status(201).json({ mensaje: 'Producto creado', producto: nuevoProducto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

// PUT /productos/:id - Actualizar
exports.actualizar = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock } = req.body;
        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            { nombre, descripcion, precio, stock },
            { new: true, runValidators: true }
        );

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ mensaje: 'Producto actualizado', producto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// DELETE /productos/:id - Eliminar
exports.eliminar = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};