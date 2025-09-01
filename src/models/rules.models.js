import { sequelize } from '../config/dbconfig/db.config.js'
import { DataTypes } from 'sequelize'

export const Rol = sequelize.define('roles',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false
    },
    description:{
        type: DataTypes.STRING,
        allowNull:false
    },
    status:{
        type: DataTypes.ENUM,
        values: ['available', 'cancelled'],
        allowNull: false,
        defaultValue: 'available'
    }

})