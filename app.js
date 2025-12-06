require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


const authRoutes = require('./src/routes/auth-routes');
const recipeRoutes = require('./src/routes/recipe-routes');
const userRoutes = require('./src/routes/user-routes'); // Vital para favoritos y admin

const app = express();
const PORT = process.env.PORT || 3000;
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Conectado'))
    .catch(err => console.error('❌ Error DB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/recetas', recipeRoutes);
app.use('/api/users', userRoutes); // RUTA DE USUARIOS REGISTRADA

app.get('/', (req, res) => res.redirect('/Vistavisitante/home.html'));

app.listen(PORT, () => console.log(`🚀 Corriendo en http://localhost:${PORT}`));