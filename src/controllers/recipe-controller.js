const Recipe = require('../models/Recipe');
const User = require('../models/User'); // Necesario para obtener el nombre del usuario

// CREAR RECETA 
exports.createRecipe = async (req, res) => {
    // ... (Código de createRecipe sin cambios) ...
    try {
        const nuevaReceta = new Recipe({ ...req.body, autor: req.user.id });
        const receta = await nuevaReceta.save();
        res.status(201).json(receta);
    } catch (error) { console.error(error); res.status(500).json({ msg: 'Error al crear la receta' }); }
};

// OBTENER RECETAS (pública con paginación y filtros)
exports.getRecipes = async (req, res) => {
    // ... (Código de getRecipes sin cambios) ...
    try {
        const { page = 1, limit = 10, categoria, titulo } = req.query;
        let query = {};
        if (categoria) query.categoria = categoria;
        if (titulo) query.titulo = { $regex: titulo, $options: 'i' }; 

        const recetas = await Recipe.find(query)
            .limit(limit * 1).skip((page - 1) * limit)
            .populate('autor', 'nombre').sort({ createdAt: -1 });

        const count = await Recipe.countDocuments(query);
        res.json({ recetas, totalPages: Math.ceil(count / limit), currentPage: Number(page) });
    } catch (error) { console.error(error); res.status(500).json({ msg: 'Error al obtener recetas' }); }
};

// Obtener receta por ID
exports.getRecipeById = async (req, res) => {
    try {
        const receta = await Recipe.findById(req.params.id).populate('autor', 'nombre');
        if (!receta) return res.status(404).json({ msg: 'Receta no encontrada' });
        res.json(receta);
    } catch (error) { console.error(error); res.status(500).json({ msg: 'Error del servidor' }); }
};

// --- FUNCIÓN NUEVA: Publicar Comentario ---
exports.postComment = async (req, res) => {
    try {
        const { text } = req.body;
        const recipeId = req.params.id;
        
        if (!text) {
            return res.status(400).json({ msg: 'El comentario no puede estar vacío.' });
        }

        const [user, recipe] = await Promise.all([
            User.findById(req.user.id),
            Recipe.findById(recipeId)
        ]);

        if (!recipe) {
            return res.status(404).json({ msg: 'Receta no encontrada.' });
        }

        // Creamos el objeto comentario
        const newComment = {
            user: req.user.id,
            username: user.nombre, // Obtenemos el nombre del usuario logueado
            text: text
        };

        // Añadir y guardar
        recipe.comments.push(newComment);
        await recipe.save();

        // Devolvemos el último comentario (el que se acaba de crear)
        res.status(201).json(recipe.comments[recipe.comments.length - 1]); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al publicar el comentario.' });
    }
};

// FUNCIÓN DE EDICIÓN (PUT)
exports.updateRecipe = async (req, res) => {
    // ... (Código de updateRecipe sin cambios) ...
    try {
        let receta = await Recipe.findById(req.params.id);
        if (!receta) return res.status(404).json({ msg: 'Receta no encontrada' });
        if (receta.autor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'No autorizado para editar' });
        }
        receta = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(receta);
    } catch (error) { console.error(error); res.status(500).json({ msg: 'Error al actualizar' }); }
};

// ELIMINAR RECETA
exports.deleteRecipe = async (req, res) => {
    // ... (Código de deleteRecipe sin cambios) ...
    try {
        const receta = await Recipe.findById(req.params.id);
        if (!receta) return res.status(404).json({ msg: 'Receta no encontrada' });
        if (receta.autor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'No autorizado para eliminar esta receta' });
        }
        await receta.deleteOne();
        res.json({ msg: 'Receta eliminada' });
    } catch (error) { console.error(error); res.status(500).json({ msg: 'Error al eliminar' }); }
};