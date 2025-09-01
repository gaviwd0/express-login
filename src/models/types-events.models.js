import {sequelize} from '../config/dbconfig/db.config.js'
import { DataTypes } from 'sequelize'

export const TypeEvent = sequelize.define('Types_Events',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allownull:false
    }
})