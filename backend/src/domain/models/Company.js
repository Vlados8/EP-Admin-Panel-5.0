const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Company = sequelize.define('Company', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    billing_plan: {
        type: DataTypes.ENUM('free', 'pro', 'enterprise'),
        defaultValue: 'pro'
    }
}, {
    tableName: 'companies'
});

module.exports = Company;
