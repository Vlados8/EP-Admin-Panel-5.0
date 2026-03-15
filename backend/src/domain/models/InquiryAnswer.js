const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

// This table stores the specific answers to the category questions for an inquiry
const InquiryAnswer = sequelize.define('InquiryAnswer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    inquiry_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'inquiries',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // The ID of the specific question answered
        references: {
            model: 'questions',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    answer_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // If they selected a predefined answer
        references: {
            model: 'answers',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    answer_value: {
        type: DataTypes.TEXT,
        allowNull: true // e.g. "Satteldach", "2015", or custom text
    }
}, {
    tableName: 'inquiry_answers',
    timestamps: true
});

module.exports = InquiryAnswer;
