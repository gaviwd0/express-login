import { sequelize } from '../config/dbconfig/db.config.js';
//importaciones de modelos
import { User } from './users.models.js'
import { Rol } from './rules.models.js'

// revisar relaciones
export const initModels = () => {
    User.belongsToMany(Rol, { through: 'user_roles' });
    Rol.belongsToMany(User, { through: 'user_roles' });
}

export const initDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión establecida con la base de datos.')
        // Usar { force: true } solo en desarrollo, ya que borra y recrea las tablas.
        await sequelize.sync({ force: process.env.APP_MODE === 'dev' });
        console.log('Base de datos sincronizada con éxito.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

// Inserción de datos por defecto para desarrollo (roles y usuario de prueba)
export const insertDevs = async () => {
    try {
        const rolCount = await Rol.count();
        if (rolCount === 0) {
            await Rol.bulkCreate([
                {name: 'unsigned', description: 'Rol sin permisos, usuario sin asignar'},
                { name: 'admin', description: 'Rol con todos los permisos del sistema.' },
                { name: 'client', description: 'Rol para usuarios/clientes con permisos básicos.' },
                { name: 'moderator', description: 'Rol para moderadores con permisos específicos.' },
            ]);
            console.log('Roles por defecto (admin, client, moderator) insertados con éxito.');
        }
        const userCount = await User.count();
        if (userCount === 0) {
            const adminUser = await User.create({
                name: process.env.TUSER_NAME,
                email: process.env.TUSER_EMAIL,
                password: process.env.TUSER_PASSWORD
            });
            const adminRole = await Rol.findOne({ where: { name: 'admin' } });
            if (adminUser && adminRole) {
                await adminUser.addRole(adminRole);
                console.log('Usuario administrador de prueba creado y rol "admin" asignado.');
            }
        }
    } catch (error) {
        console.error('Error al insertar datos de desarrollo:', error);
    }
}