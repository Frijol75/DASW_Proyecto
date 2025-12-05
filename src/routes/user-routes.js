const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const auth = require('../middlewares/auth-middleware');

// Rutas Admin
router.get('/', auth, userController.getAllUsers);
router.delete('/:id', auth, userController.deleteUser);

// Rutas Favoritos
router.get('/favorites', auth, userController.getFavorites);
router.post('/favorites/:id', auth, userController.toggleFavorite);

module.exports = router;