// src/controllers/authController.js
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrar = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        }

        // Verificar si el usuario ya existe
        const existe = await Usuario.findOne({ username });
        if (existe) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Encriptar contraseña con bcrypt (10 salt rounds)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const nuevoUsuario = new Usuario({
            username,
            password: hashedPassword
        });

        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};