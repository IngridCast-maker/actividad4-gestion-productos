// api/index.js - Versión ultra-robusta para Vercel
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB (NO bloquea la app si falla)
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000
        });
        isConnected = true;
        console.log('✅ MongoDB conectado');
    } catch (error) {
        console.error('⚠️ MongoDB no conectado (la app sigue funcionando):', error.message);
    }
};
connectDB();

// Cargar rutas con try/catch para que no rompan la app
try {
    const authRoutes = require('../src/routes/authRoutes');
    const productoRoutes = require('../src/routes/productoRoutes');
    app.use('/api/auth', authRoutes);
    app.use('/api/productos', productoRoutes);
} catch (error) {
    console.error('⚠️ Error cargando rutas:', error.message);
}

// Ruta raíz: servir index.html
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, '..', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.json({ mensaje: 'API de Gestión de Productos funcionando correctamente' });
    }
});

// Ruta para index.html explícita
app.get('/index.html', (req, res) => {
    const indexPath = path.join(__dirname, '..', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('HTML no encontrado');
    }
});

// Ruta de prueba API
app.get('/api', (req, res) => {
    res.json({ mensaje: 'API funcionando correctamente' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Error interno' });
});

module.exports = app;