const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ProjectSubcontractor = sequelize.define('ProjectSubcontractor', {
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
    subcontractor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'subcontractors',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'project_subcontractors',
    timestamps: true
});

module.exports = ProjectSubcontractor;
