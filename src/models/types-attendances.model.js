import { sequelize } from '../config/dbconfig/db.config.js'
import { DataTypes } from 'sequelize'

export const TypeAttendance = sequelize.define('Types_Attendances', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})