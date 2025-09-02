import dotenv from 'dotenv';
dotenv.config();
import { sequelize } from '../config/dbconfig/db.config.js';
//importaciones de modelos
import { User, Rol, Assist, Career, Event, TypeEvent, Location, Institution, Student, OtherAttendance, TypeAttendance, CategoryEvent } from '../models/index.js'


// revisar relaciones
export const initModels = () => {
    // asociaciones de usuario

    User.belongsToMany(Rol, { through: 'user_roles' });
    Rol.belongsToMany(User, { through: 'user_roles' });

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

    Student.hasMany(Assist, { foreignKey: 'student_id', allowNull: true })
    Assist.belongsTo(Student, { foreignKey: 'student_id', allowNull: true })

    OtherAttendance.hasMany(Assist, {
        foreignKey:'other_attendance_id',
        allowNull: true
    });
    Assist.belongsTo(OtherAttendance, {
        foreignKey:'other_attendance_id',
        allowNull: true
    });

    //relaciones N:M
        //relaciones en #Institutions
    Location.belongsToMany(Institution, { through: 'Locations_Institutions', allowNull: true})
    Institution.belongsToMany(Location, { through: 'Locations_Institutions', allowNull: true})
        
        //Eventos
    Event.belongsToMany(Location,{through:'Events_Locations'})
    Location.belongsToMany(Event,{through:'Events_Locations'})

    Event.belongsToMany(TypeAttendance,{through:'Events_TypeAttendances'})
    TypeAttendance.belongsToMany(Event,{through:'Events_TypeAttendances'})

    Event.belongsToMany(Career,{through:'Events_Careers'})
    Career.belongsToMany(Event,{through:'Events_Careers'})

    Event.belongsToMany(CategoryEvent,{through:'Events_CategoryEvents', allowNull: true })
    CategoryEvent.belongsToMany(Event,{through:'Events_CategoryEvents', allowNull: true })



}

export const initDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión establecida con la base de datos.')
        // Usar { force: true } solo en desarrollo, ya que borra y recrea las tablas.
        await sequelize.sync({ force: process.env.APP_MODE === 'dev'});
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

       
            const locationCount = await Location.count()
            const institutionCount = await Institution.count()
            const studentCount = await Student.count()
            const careerCount = await Career.count()
            const eventCount = await Event.count()
            const typeEventCount = await TypeEvent.count()
            const typeAttendanceCount = await TypeAttendance.count()
            const otherAttendanceCount = await OtherAttendance.count()
            const assistCount = await Assist.count()
            const categoryEventCount = await CategoryEvent.count()
            // si todo da 0 crea inserts
            if(locationCount === 0 && institutionCount === 0 && studentCount === 0 && careerCount === 0 && eventCount === 0 && typeEventCount === 0 && typeAttendanceCount === 0 && otherAttendanceCount === 0 && assistCount === 0 && categoryEventCount === 0){
                //institution inserts
                const devInsertInstitution = await Institution.bulkCreate([
                    {name:"instituto 26", description:"instituto de formacion ...."}
                ])

                //location insert
                const devInsertLocation = await Location.create(
                {name: "Escuela 1", description: "sede 1 del instituto 26", radius_meters:100, latitud:-36.31649314, longitud:-57.67856064 }
              )

                //careers inserts
                const devInsertCareer = await Career.bulkCreate([
                    {name:"software", duration_years:3}
                ])

                //categoryEvent inserts
                const devInsertCategoryEvent = await CategoryEvent.bulkCreate([
                    {name:"tecnologia", description:"eventos de tecnologia..."}
                ])

                //typeAttendances inserts
                const devInsertTypeAttendance = await TypeAttendance.bulkCreate([
                    {name:"Profesores"}
                ])
                
                //type-events inserts
                const devInsertTypeEvent = await TypeEvent.bulkCreate([
                    {name:"semi virtual"}
                ])

                //event inserts
                const devInsertEvent = await Event.create(
                    {name:"Jornada test", description:"esto es un evento..", init_date:"2025-10-15 18:00:00",create_date:"2025-09-01",type_event_id:1}
                )

                //student inserts
                const devInsertStudent = await Student.bulkCreate([
                    {identification:"46000000", name:"testStudent", lastname:"testStudentLastname",email:"teststudent@gmail.com",phone:"1233333",career_id:1}
                ])

                //other attendance inserts
                const devInsertOtherAttendance = await OtherAttendance.bulkCreate([
                    {identification:"46000001", name:"nameOther",lastname:"lastnameOther",email:"othertest@gmail.com",phone:"1233333",type_attendance_id:1}
                ])

                //assist inserts
                const devInsertAssist = await Assist.bulkCreate([
                    {register_date:"2025-10-15 18:00:00",event_id:1,student_id:1}
                ])
                console.log(Object.keys(Location.prototype))
                //tablas intemedias inserts
                //Event
                 devInsertEvent.addLocation(1)
                 devInsertEvent.addTypes_Attendance(1)
                 devInsertEvent.addCareer(1)
                 devInsertEvent.addCategorys_Event(1)
                //Location
                devInsertLocation.addInstitution(1)
            }  else return console.log('ya hay registros en la base de datos')
            
    } catch (error) {
        console.error('Error al insertar datos de desarrollo:', error);
    }
}