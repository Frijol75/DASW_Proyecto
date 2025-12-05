const User = require('../models/User');

// Obtener todos los usuarios (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener usuarios' });
    }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar usuario' });
    }
};

// --- LOGICA DE FAVORITOS ---
exports.toggleFavorite = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user.id;

        const user = await User.findById(userId);
        
        // Verificar si ya es favorito
        const index = user.favoritos.findIndex(id => id.toString() === recipeId);

        let isFavorite = false;
        if (index === -1) {
            user.favoritos.push(recipeId); // Agregar
            isFavorite = true;
        } else {
            user.favoritos.splice(index, 1); // Quitar
            isFavorite = false;
        }
        
        await user.save();
        res.json({ isFavorite }); // Respondemos el nuevo estado

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar favoritos' });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        // Traemos al usuario y "rellenamos" (populate) sus recetas favoritas
        const user = await User.findById(req.user.id).populate('favoritos');
        res.json(user.favoritos);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener favoritos' });
    }
};