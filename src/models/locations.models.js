import {sequelize} from '../config/dbconfig/db.config.js'
import { DataTypes } from 'sequelize'

export const Location = sequelize.define('Locations',{
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
        allowNull:true
    },
    radius_meters:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    latitud:{
        type: DataTypes.DECIMAL(9,8),
        allowNull:false
    },
    longitud:{
        type: DataTypes.DECIMAL(9,8),
        allowNull:false
    },
    avaible:{
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    }
})