const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    specialty: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active' // Enum mapping user state
    },
    company_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    role_id: {
        type: DataTypes.UUID,
        allowNull: true // Default role should be mapped later
    },
    manager_id: {
        type: DataTypes.UUID,
        allowNull: true // Links to another User (e.g. Gruppenleiter or Projektleiter)
    }
}, {
    tableName: 'users'
});

module.exports = User;
