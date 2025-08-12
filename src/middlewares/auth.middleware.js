import jwt from 'jsonwebtoken';
import { User } from '../models/users.models.js';
import { Rol } from '../models/rules.models.js';

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



export const authorizeRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        // 1. Asegurarnos de que el middleware authRequired se ejecutó y tenemos un usuario con ID
        if (!req.user || !req.user.id) {
            return res.status(403).json({ message: 'Forbidden: User information is missing.' });
        }

        try {
            // 2. Buscar al usuario en la BD y sus roles asociados
            const user = await User.findByPk(req.user.id, {
                include: {
                    model: Rol,
                    attributes: ['name'], // Solo necesitamos el nombre del rol
                    through: { attributes: [] } // No necesitamos datos de la tabla intermedia
                }
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // 3. Extraer los nombres de los roles del usuario
            const userRoles = user.roles.map(role => role.name);

            // 4. Comprobar si el usuario tiene alguno de los roles permitidos
            const hasRequiredRole = userRoles.some(role => allowedRoles.includes(role));

            if (!hasRequiredRole) {
                return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
            }

            // 5. Si todo está bien, continuar
            next();
        } catch (error) {
            console.error('Error during role authorization:', error);
            return res.status(500).json({ message: 'Server error during authorization.' });
        }
    };
};
