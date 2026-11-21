// src/models/Producto.js
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0 // Evita precios negativos (Validación básica - Error Card #8)
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);