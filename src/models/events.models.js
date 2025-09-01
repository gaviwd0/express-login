import { sequelize } from '../config/dbconfig/db.config.js'
import { DataTypes } from 'sequelize'

export const Event = sequelize.define('Events', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    init_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    create_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    // cantidad de dias de extencion del evento
    days_extension: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    // los usuarios se pueden registrar si esta en true y no si esta en false
    registers: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})