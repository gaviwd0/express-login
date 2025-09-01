import {sequelize} from '../config/dbconfig/db.config.js'
import { DataTypes } from 'sequelize'

export const Student = sequelize.define('Students',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    identification:{
        type: DataTypes.STRING(22),
        allowNull:false,
        unique:true
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false
    },
    lastname:{
        type: DataTypes.STRING,
        allowNull:false
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    phone:{
        type: DataTypes.STRING,
        allowNull:true
    }
})