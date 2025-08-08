import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authRequired = (req, res, next) => {
    // 1. Leemos el token de la cookie
    const { access_token } = req.cookies;

    // 2. Si no hay token, el usuario no está autorizado
    if (!access_token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 3. Si hay token, lo verificamos
    try {
        const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
        // 4. Guardamos los datos del usuario en el objeto request para uso posterior
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};


// modificar esto para usar roles
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action' });
        }
        next();
    };
};
