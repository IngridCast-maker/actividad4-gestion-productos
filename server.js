// server.js - Compatible con Vercel y local
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conexión a MongoDB (sin bloquear la app)
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        isConnected = true;
        console.log('✅ Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('❌ Error MongoDB:', error.message);
    }
};

// Conectar al iniciar
connectDB();

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