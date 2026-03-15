const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const TaskImage = sequelize.define('TaskImage', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    task_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'task_images',
    timestamps: true
});

module.exports = TaskImage;
