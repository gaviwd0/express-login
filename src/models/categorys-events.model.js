import {sequelize} from '../config/dbconfig/db.config.js'
import { DataTypes } from 'sequelize'

export const CategoryEvent= sequelize.define('Categorys_Events',{
    id:{
       type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:true
    }
})