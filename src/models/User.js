const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { 
        type: String, 
        required: true,
        select: false // CLAVE: Ocultar por seguridad
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }], // Lista de favoritos
    fechaRegistro: { type: Date, default: Date.now }
});

// MIDDLEWARE PRE-SAVE: Encriptar la contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);