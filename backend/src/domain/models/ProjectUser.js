const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ProjectUser = sequelize.define('ProjectUser', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    project_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'projects',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    role: {
        type: DataTypes.ENUM('projektleiter', 'gruppenleiter', 'worker'),
        allowNull: false
    }
}, {
    tableName: 'project_users',
    timestamps: true
});

module.exports = ProjectUser;
