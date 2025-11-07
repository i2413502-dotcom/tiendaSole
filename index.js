// index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
// Render asigna el puerto automáticamente
const PORT = process.env.PORT || 10000;

// Cambia a tu URL de Render
const allowedOrigin = 'https://mi-tienda-3gro.onrender.com';

// Middlewares
app.use(cors({
  origin: allowedOrigin
}));
app.use(bodyParser.json());

// IPs válidas
app.use((req, res, next) => {
  let clientIP = req.headers['x-forwarded-for'] || req.ip || (req.connection && req.connection.remoteAddress);
  if (clientIP && clientIP.includes(',')) {
    clientIP = clientIP.split(',')[0].trim();
  }

  const allowedIPs = ['45.232.149.130', '45.232.149.146', '45.232.149.145', '45.5.57.209', '169.197.142.208'];

  if (allowedIPs.includes(clientIP)) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado: IP no permitida' });
  }
});


// Archivos estáticos (frontend en /public)
app.use(express.static(path.join(__dirname, 'public')));

// === Documentación Swagger (si existe) ===
try {
  const { swaggerUi, swaggerSpecs } = require('./swagger');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
} catch (e) {
  // Si no existe swagger.js, se omite la documentación.
}

// Rutas API
const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const imagenesRoutes  = require('./routes/imagenes');
const authRoutes = require('./routes/auth');

app.use('/categorias', categoriasRoutes);
app.use('/productos', productosRoutes);
app.use('/imagenes', imagenesRoutes);
app.use('/auth', authRoutes);

// Si en el futuro agregas una ruta de usuarios, registra aquí:
// const usuariosRoutes = require('./routes/usuarios');
// app.use('/usuarios', usuariosRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});
