import { sequelize } from '../config/dbconfig/db.config.js';
//importaciones de modelos
import {UserRoles, User, Rol, Assist, Career, Event, TypeEvent, Location, Institution, Student, OtherAttendance, TypeAttendance } from '../models/index.js'

// revisar relaciones
export const initModels = () => {
    // asociaciones de usuario

    User.belongsToMany(Rol, { through: UserRoles });
    Rol.belongsToMany(User, { through: UserRoles });

    // asociaciones del sistema

    //relaciones en #Events
    TypeEvent.hasMany(Event, { foreignKey: 'type_event_id' })
    Event.belongsTo(TypeEvent, { foreignKey: 'type_event_id' })

    //relaciones en  #Students
    Career.hasMany(Student, { foreignKey: 'career_id' })
    Student.belongsTo(Career, { foreignKey: 'career_id' })

    //relaciones en #OthersAttendances
    TypeAttendance.hasMany(OtherAttendance, { foreignKey: 'type_attendance_id' })
    OtherAttendance.belongsTo(TypeAttendance, { foreignKey: 'type_attendance_id' })

    //relaciones en #Assists
    Event.hasMany(Assist, { foreignKey: 'event_id' })
    Assist.belongsTo(Event, { foreignKey: 'event_id' })

    Student.hasMany(Assist, { foreignKey: 'student_id' })
    Assist.belongsTo(Student, { foreignKey: 'student_id' })

    OtherAttendance.hasMany(Assist, {
        foreignKey: { name: 'other_attendance_id', allowNull: true }
    });
    Assist.belongsTo(OtherAttendance, {
        foreignKey: { name: 'other_attendance_id', allowNull: true }
    });
    
    //relaciones en #Institutions
    Location.hasMany(Institution, { foreignKey: 'location_id' })
    Institution.belongsTo(Location, { foreignKey: 'location_id', allowNull: true})
        //relaciones N:M
    //Eventos
    Event.belongsToMany(Location,{through:'Events_Locations'})
    Location.belongsToMany(Event,{through:'Events_Locations'})

    Event.belongsToMany(TypeAttendance,{through:'Events_TypeAttendances'})
    TypeAttendance.belongsToMany(Event,{through:'Events_TypeAttendances'})

    Event.belongsToMany(Career,{through:'Events_Careers'})
    Career.belongsToMany(Event,{through:'Events_Careers'})



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
        // Inserts en Rol
        const rolCount = await Rol.count();
        if (rolCount === 0) {
            await Rol.bulkCreate([
                { name: 'unsigned', description: 'Rol sin permisos, usuario sin asignar' },
                { name: 'admin', description: 'Rol con todos los permisos del sistema.' },
                { name: 'client', description: 'Rol para usuarios/clientes con permisos básicos.' },
                { name: 'moderator', description: 'Rol para moderadores con permisos específicos.' },
            ]);
            console.log('Roles por defecto (admin, client, moderator) insertados con éxito.');
        }
        //inserts en User
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

        const  systemTablesCount =  async() =>{
            const locationCount = await Location.count()
            const institutionCount = await Institution.count()
            const studentCount = await Student.count()
            const careerCount = await Career.count()
            const eventCount = await Event.count()
            const typeEventCount = await TypeEvent.count()
            const typeAttendanceCount = await TypeAttendance.count()
            const otherAttendanceCount = await OtherAttendance.count()
            const assistCount = await Assist.count()
        
            if(locationCount === 0 && institutionCount === 0 && studentCount === 0 && careerCount === 0 && eventCount === 0 && typeEventCount === 0 && typeAttendanceCount === 0 && otherAttendanceCount === 0 && assistCount === 0){
                console.log('hola')
            }
        }
    } catch (error) {
        console.error('Error al insertar datos de desarrollo:', error);
    }
}