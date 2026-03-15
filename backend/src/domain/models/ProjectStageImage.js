const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ProjectStageImage = sequelize.define('ProjectStageImage', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    project_stage_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'project_stage_images',
    timestamps: true
});

module.exports = ProjectStageImage;
