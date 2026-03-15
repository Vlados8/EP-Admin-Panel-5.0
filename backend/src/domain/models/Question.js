const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subcategory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'subcategories',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    field_key: {
        type: DataTypes.STRING,
        allowNull: true
    },
    question_text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('radio', 'checkbox', 'input', 'select', 'slider', 'buttons'),
        defaultValue: 'radio'
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: true
    },
    config: {
        type: DataTypes.JSON, // min, max, step for sliders
        allowNull: true
    },
    order_index: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'questions',
    timestamps: true,
    paranoid: true,
});

module.exports = Question;
