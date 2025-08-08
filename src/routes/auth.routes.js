import { Router } from 'express';
import { register, login, logout, refreshToken } from '../controllers/auth.controller.js';
import { authRequired} from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para el registro, inicio y cierre de sesión de usuarios.
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Autenticación]
 *     description: Crea un nuevo usuario en la base de datos con nombre, email, contraseña y rol. La contraseña se encripta antes de guardarse.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre completo del usuario.
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico único del usuario.
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario (mínimo 8 caracteres).
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 description: Rol del usuario.
 *                 enum: [client, employee]
 *                 example: "client"
 *     responses:
 *       '201':
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                   example: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 *       '400':
 *         description: Error en la solicitud. Puede ser por un email duplicado u otros errores de validación de la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating user"
 *                 error:
 *                   type: string
 *                   example: "Validation error: email must be unique"
 */
router.post('/register', register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     tags: [Autenticación]
 *     description: Autentica a un usuario con su email y contraseña. Si las credenciales son correctas, establece dos cookies httpOnly `access_token` (corta duración) y `refreshToken` (larga duración).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario.
 *                 example: "password123"
 *     responses:
 *       '200':
 *         description: Inicio de sesión exitoso. Las cookies de autenticación han sido establecidas.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "access_token=...; Path=/; HttpOnly, refreshToken=...; Path=/; HttpOnly"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *       '401':
 *         description: Credenciales inválidas. El email no existe o la contraseña es incorrecta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/login', login);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Cierra la sesión del usuario
 *     tags: [Autenticación]
 *     description: Cierra la sesión del usuario actual eliminando las cookies `access_token` y `refreshToken`. Requiere que el usuario esté autenticado (debe existir una cookie `access_token` válida).
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Sesión cerrada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       '401':
 *         description: No autorizado. El usuario no ha iniciado sesión o el token de acceso ha expirado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No token, authorization denied"
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/logout',authRequired, logout)

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresca el token de acceso
 *     tags: [Autenticación]
 *     description: >
 *       Utiliza la cookie `refreshToken` (de larga duración) para generar un nuevo `access_token` (de corta duración).
 *       Este endpoint se debe llamar cuando el `access_token` ha expirado para mantener la sesión del usuario activa sin necesidad de volver a iniciar sesión.
 *       No requiere un `access_token` para ser llamado, pero sí una cookie `refreshToken` válida.
 *     responses:
 *       '200':
 *         description: Token de acceso refrescado exitosamente. Se ha establecido una nueva cookie `access_token`.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "access_token=...; Path=/; HttpOnly"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token refreshed successfully"
 *       '401':
 *         description: No se proporcionó un token de refresco. La cookie `refreshToken` no fue encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No refresh token provided, authorization denied."
 *       '403':
 *         description: Token de refresco inválido o expirado. El usuario debe volver a iniciar sesión.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired refresh token. Please log in again."
 */
router.post('/refresh-token', refreshToken);
export default router;