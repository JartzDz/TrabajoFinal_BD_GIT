const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const testUserRoutes = require('./routes/testUserRoutes');
const productosRoutes = require('./routes/productosRoutes'); 
const userRoutes = require('./routes/userRoutes');
const ofertasRoutes = require('./routes/ofertasRoutes');
const direccionesRoutes = require('./routes/direccionesRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json()); 

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/test', testUserRoutes);
app.use('/api/productos', productosRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/users', userRoutes);
app.use('/api/direcciones', direccionesRoutes);
app.use('/api/ofertas',ofertasRoutes)
app.use('/api/categorias', categoriasRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const pool = require('./config/db');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos:', res.rows[0]);
  }
});
