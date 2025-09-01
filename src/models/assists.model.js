import { sequelize } from '../config/dbconfig/db.config.js'
import { DataTypes } from 'sequelize'

export const Assist = sequelize.define('Assists',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    register_date:{
        type: DataTypes.DATE,
        allowNull: false
    }
})