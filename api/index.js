// api/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
    } catch (error) {
        console.error('MongoDB Error:', error.message);
    }
};

connectDB();

const authRoutes = require('../src/routes/authRoutes');
const productoRoutes = require('../src/routes/productoRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);

app.get('/', (req, res) => {
    res.json({ mensaje: 'API funcionando' });
});

module.exports = app;