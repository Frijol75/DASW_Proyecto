const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Leer token del header
    const token = req.header('x-auth-token');

    // Revisar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso denegado' });
    }

    // Validar token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Guardamos datos del usuario en la request
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};