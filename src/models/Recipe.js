const mongoose = require('mongoose');

// --- ESQUEMA DE COMENTARIO ---
const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String, // Guardamos el nombre del usuario para mostrarlo fácilmente
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// ----------------------------

const recipeSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    ingredientes: [{
        nombre: String,
        cantidad: String,
        unidad: String
    }],
    pasos: [String],
    tiempoPrep: { type: Number, required: true },
    tiempoCoccion: { type: Number, required: true },
    categoria: { 
        type: String, 
        enum: ['desayuno', 'comida', 'cena', 'postre', 'entrada', 'mexicana', 'pasta', 'vegetariana'],
        required: true 
    },
    imageUrl: { type: String },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [CommentSchema], // <-- NUEVO CAMPO
    calificaciones: [{
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        puntuacion: { type: Number, min: 1, max: 5 }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);