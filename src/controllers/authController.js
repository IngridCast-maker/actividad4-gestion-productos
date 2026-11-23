// src/controllers/authController.js
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registrar = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        }

        const existe = await Usuario.findOne({ username });
        if (existe) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = new Usuario({
            username,
            password: hashedPassword
        });

        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error en registrar:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        }

        const usuario = await Usuario.findOne({ username });
        if (!usuario) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        const esValido = await bcrypt.compare(password, usuario.password);
        if (!esValido) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: usuario._id, username: usuario.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ mensaje: 'Login exitoso', token });
    } catch (error) {
        console.error('Error en login:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { registrar, login };