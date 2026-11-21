// src/controllers/authController.js
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario (Error Card #3: contraseñas encriptadas con bcrypt)
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

// Login de usuario (Error Card #2: generación de JWT)
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        }

        // Buscar usuario
        const usuario = await Usuario.findOne({ username });
        if (!usuario) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // Comparar contraseña encriptada
        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: usuario._id, username: usuario.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ mensaje: 'Login exitoso', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};