import { Router } from 'express';
import { authRequired, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/v1/test-roles/admin-only:
 *   get:
 *     summary: Ruta de prueba solo para administradores.
 *     tags: [Test Roles]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Acceso concedido.
 *       401:
 *         description: No autorizado (sin token).
 *       403:
 *         description: Prohibido (sin el rol de admin).
 */
router.get('/admin-only', authRequired, authorizeRoles('admin'), (req, res) => {
    res.status(200).json({ message: '¡Acceso concedido! Bienvenido al panel de administrador.' });
});

router.get('/moderator-area', authRequired, authorizeRoles('admin', 'moderator'), (req, res) => {
    res.status(200).json({ message: '¡Acceso concedido al área de moderación!' });
});

router.get('/profile', authRequired, authorizeRoles('admin', 'moderator', 'client', 'unsigned'), (req, res) => {

    res.status(200).json({ message: `Bienvenido a tu perfil. Tu ID de usuario es: ${req.user.id}` });
});

export default router;