// src/tests/producto.test.js
const request = require('supertest');
const express = require('express');
const Producto = require('../models/Producto');

// 1. Mock (Simulacro) del Middleware de Autenticación
// Esto evita que las pruebas fallen por falta de token JWT
jest.mock('../middleware/authMiddleware', () => (req, res, next) => {
    req.user = { id: 'testUserId', username: 'testUser' };
    next();
});

const productoRoutes = require('../routes/productoRoutes');

// 2. Mock del Modelo de Producto (Simula la base de datos)
jest.mock('../models/Producto');

// Configurar la app de Express para las pruebas
const app = express();
app.use(express.json());
app.use('/api/productos', productoRoutes);

describe('Rutas de Productos (CRUD)', () => {
    // Limpiar mocks antes de cada prueba
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // --- PRUEBA 1: Obtener todos los productos ---
    describe('GET /api/productos', () => {
        it('debería obtener todos los productos con estado 200', async () => {
            const mockProductos = [
                { _id: '1', nombre: 'Laptop', precio: 15000 },
                { _id: '2', nombre: 'Mouse', precio: 500 }
            ];
            
            // Simular que la base de datos devuelve estos productos
            Producto.find.mockResolvedValue(mockProductos);

            const res = await request(app).get('/api/productos');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockProductos);
            expect(Producto.find).toHaveBeenCalledTimes(1);
        });
    });

       // --- PRUEBA 2: Crear un producto exitosamente ---
    describe('POST /api/productos', () => {
        it('debería crear un nuevo producto con estado 201', async () => {
            const nuevoProducto = { 
                nombre: 'Teclado Mecánico', 
                descripcion: 'RGB', 
                precio: 1200, 
                stock: 10 
            };
            
            // Simular el método save() de Mongoose
            const mockSavedProducto = { _id: '3', ...nuevoProducto };
            Producto.prototype.save = jest.fn().mockResolvedValue(mockSavedProducto);
            
            // Simular el constructor de Producto
            Producto.mockImplementation(() => ({
                ...nuevoProducto,
                save: Producto.prototype.save
            }));

            const res = await request(app)
                .post('/api/productos')
                .send(nuevoProducto);

            expect(res.statusCode).toBe(201);
            expect(res.body.mensaje).toBe('Producto creado');
            expect(res.body.producto).toBeDefined();
            expect(res.body.producto.nombre).toBe('Teclado Mecánico');
        });
    });

    // --- PRUEBA 3: Validación de datos (Error Card #8) ---
    describe('POST /api/productos - Validación', () => {
        it('debería retornar 400 si faltan campos obligatorios', async () => {
            const productoInvalido = { nombre: 'Teclado' }; // Faltan descripcion y precio

            const res = await request(app)
                .post('/api/productos')
                .send(productoInvalido);

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBeDefined();
        });
    });

    // --- PRUEBA 4: Obtener producto por ID no encontrado ---
    describe('GET /api/productos/:id', () => {
        it('debería retornar 404 si el producto no existe', async () => {
            Producto.findById.mockResolvedValue(null);

            const res = await request(app).get('/api/productos/idInexistente');

            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe('Producto no encontrado');
        });
    });
});