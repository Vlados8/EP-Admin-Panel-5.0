const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ProjectAnswer = sequelize.define('ProjectAnswer', {
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
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'questions',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    answer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'answers',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    custom_value: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'project_answers',
    timestamps: true
});

module.exports = ProjectAnswer;
