const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe-controller');
const auth = require('../middlewares/auth-middleware');

// Rutas Públicas (GET)
router.get('/', recipeController.getRecipes);
router.get('/:id', recipeController.getRecipeById);

// Rutas Privadas (Requieren Token)
router.post('/', auth, recipeController.createRecipe);
router.put('/:id', auth, recipeController.updateRecipe);
router.delete('/:id', auth, recipeController.deleteRecipe);

// --- RUTA NUEVA: POSTEAR COMENTARIO ---
router.post('/:id/comments', auth, recipeController.postComment); 
// -------------------------------------

module.exports = router;