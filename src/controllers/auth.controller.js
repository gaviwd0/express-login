import { User } from '../models/users.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

//register func
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await User.create({ name, email, password, role });
        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error: error.message });
    }
};
//login func
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }


        // 1. Crear Access Token (corta duración)
        const accessToken = jwt.sign({ id: user.id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATE_TIME_ACCESS || '15m'
        });

        // 2. Crear Refresh Token (larga duración)
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_REFRESH, {
            expiresIn: process.env.JWT_EXPIRE_REFRESH_TIME || '7d'
        });

        // 3. Configurar cookies | esto es para los dos JWT
        const cookieOptions = {
            httpOnly: true,
            secure: !(process.env.APP_MODE === 'dev'),
            sameSite: 'strict'
        };

        // Duración de las cookies en milisegundos
        const accessTokenMaxAge = 1000 * 60 * 60; // 60 minutos
        const refreshTokenMaxAge = 1000 * 60 * 60 * 24 * 7; // 7 días

        res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: accessTokenMaxAge });
        res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: refreshTokenMaxAge });

        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        return console.log(error),res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//logut func
export const logout = async (req,res) =>{
    try {
        res.clearCookie('access_token');
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
         res.status(500).json({ message: 'Server error', error: error.message });
    }
}
//refreshToken func
export const refreshToken = async (req, res) => {
    // 1. Obtener el refresh token de la cookie
    const tokenFromCookie = req.cookies.refreshToken;
    // caso 1 , cookie del token refresh no existente
    if (!tokenFromCookie) {
        return res.status(401).json({ message: 'No refresh token provided, authorization denied.' });
    }

    try {
        // 2. Verificar el refresh token con su secreto
        const decoded = jwt.verify(tokenFromCookie, process.env.JWT_SECRET_REFRESH);

        // 3. Comprobar que el usuario todavía existe y está activo
        const user = await User.findOne({
            where: {
                id: decoded.id,
                status: 'available'
            }
        });
        if (!user || user.status === 'cancelled') {
            return res.status(401).json({ message: 'User not found or inactive, authorization denied.' });
        }
        console.log(user.id)
        // 4. Generar un nuevo access token (corta duración)
        const newAccessToken = jwt.sign(
            { id: user.id},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATE_TIME_ACCESS || '15m' }
        );

        // 5. Enviar el nuevo access token en la cookie
        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: !(process.env.APP_MODE !== 'dev'),
            sameSite: 'strict',
            maxAge: 1000 * 60 * 20 // 60 minutos
        });

        res.status(200).json({ message: 'Token refreshed successfully' });
    } catch (error) {
        // Si el refresh token es inválido o ha expirado, limpiamos las cookies por seguridad
        res.clearCookie('access_token');
        res.clearCookie('refreshToken');
        return res.status(403).json({ message: 'Invalid or expired refresh token. Please log in again.' });
    }
};
