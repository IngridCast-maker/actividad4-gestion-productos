// api/index.js - Versión con conexión garantizada
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB con reintentos
let dbConnection = null;

const connectDB = async () => {
    if (dbConnection && mongoose.connection.readyState === 1) {
        return dbConnection;
    }
    
    try {
        dbConnection = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000, // 30 segundos de timeout
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            retryWrites: true,
            w: 'majority'
        });
        console.log('✅ MongoDB conectado exitosamente');
        return dbConnection;
    } catch (error) {
        console.error('❌ Error MongoDB:', error.message);
        throw error;
    }
};

// Middleware para asegurar conexión antes de cada request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Error de conexión:', error.message);
        res.status(503).json({ error: 'Servicio no disponible, intenta de nuevo' });
    }
});

// Cargar rutas
try {
    const authRoutes = require('../src/routes/authRoutes');
    const productoRoutes = require('../src/routes/productoRoutes');
    app.use('/api/auth', authRoutes);
    app.use('/api/productos', productoRoutes);
} catch (error) {
    console.error('Error cargando rutas:', error.message);
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

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;