const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTRO
exports.register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'El usuario ya existe' });

        // El modelo User.js tiene el hook que hashea el password.
        user = new User({ nombre, email, password });
        await user.save(); 

        res.status(201).json({ msg: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // CLAVE: Obtenemos el password OCULTO para comparar
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

        // Comparamos
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

        // Generar JWT
        const payload = { user: { id: user.id, role: user.role } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            
            res.json({ token, user: { id: user.id, nombre: user.nombre, role: user.role } });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};