// server.js - Optimizado para Vercel Serverless
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de MongoDB para Vercel Serverless
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout más corto para serverless
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 1,
            retryWrites: true,
            w: 'majority'
        });
        console.log('✅ MongoDB conectado exitosamente');
    } catch (error) {
        console.error('❌ Error de conexión MongoDB:', error.message);
        process.exit(1);
    }
};

// Conectar solo una vez
if (mongoose.connection.readyState === 0) {
    connectDB();
}

// Rutas
const authRoutes = require('./src/routes/authRoutes');
const productoRoutes = require('./src/routes/productoRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// Ruta de prueba
app.get('/api', (req, res) => {
    res.json({ mensaje: 'API de Gestión de Productos funcionando correctamente' });
});

// Middleware 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Exportar para Vercel
module.exports = app;

// Solo escuchar en local
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
}