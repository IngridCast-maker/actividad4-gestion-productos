// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Conectado exitosamente a MongoDB Atlas');
    })
    .catch((error) => {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        process.exit(1);
    });

// Rutas
const authRoutes = require('./src/routes/authRoutes');
const productoRoutes = require('./src/routes/productoRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);

// Ruta de prueba (pública)
app.get('/', (req, res) => {
    res.redirect('/index.html');
});
app.get('/api', (req, res) => {
    res.json({ mensaje: 'API de Gestión de Productos funcionando correctamente' });
});

// Middleware 404 para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: `Ruta ${req.originalUrl} no encontrada` });
});

// Middleware de manejo de errores global (Error Card #7)
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.stack}`);
    res.status(err.status || 500).json({ 
        error: err.message || 'Error interno del servidor' 
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});