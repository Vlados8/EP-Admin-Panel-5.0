const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ProjectImage = sequelize.define('ProjectImage', {
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
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uploaded_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'project_images',
    timestamps: true
});

module.exports = ProjectImage;
