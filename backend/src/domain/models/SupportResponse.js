const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const SupportResponse = sequelize.define('SupportResponse', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ticket_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'support_tickets',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false // ID of the staff member making the response or logging the call
    },
    response_type: {
        type: DataTypes.ENUM('note', 'email', 'phone'),
        defaultValue: 'note',
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'support_responses',
    timestamps: true
});

module.exports = SupportResponse;
