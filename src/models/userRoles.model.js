import { sequelize } from '../config/dbconfig/db.config.js';

// Sequelize añadirá las columnas `userId` y `rolId` automáticamente.
export const UserRoles = sequelize.define('User_Roles', {
  // Puedes dejar este objeto vacío si no necesitas columnas adicionales.
}, {
});