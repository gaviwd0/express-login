import { sequelize } from '../config/dbconfig/db.config.js'
import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()


export const User = sequelize.define('users', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM,
        values: ['client', 'employee'],
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM,
        values: ['available', 'cancelled'],
        allowNull: false,
        defaultValue: 'available'
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
})


