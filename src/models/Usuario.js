// src/models/Usuario.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
        // La encriptación con bcrypt se hará en el controlador antes de guardar
    }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);