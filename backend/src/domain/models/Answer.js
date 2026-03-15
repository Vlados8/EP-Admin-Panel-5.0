const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Answer = sequelize.define('Answer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    answer_text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    next_question_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // If null, it's the end of the line (or defaults to the +1 fallback if you want, but strictly null = end)
        references: {
            model: 'questions',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    order_index: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'answers',
    timestamps: true
});

module.exports = Answer;
