const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false, // Worker, Gruppenleiter, Projektleiter, Admin
    }
}, {
    tableName: 'roles',
    timestamps: false // Roles generally don't need paranoid/timestamps
});

module.exports = Role;
