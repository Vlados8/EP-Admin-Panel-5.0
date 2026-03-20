const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const SupportTicket = sequelize.define('SupportTicket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: true // Could be null if reported by a generic user initially or from a contact form without an account
    },
    client_name: {
        type: DataTypes.STRING,
        allowNull: true // Store the name directly if no client record exists
    },
    client_email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    client_phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    project_id: {
        type: DataTypes.UUID,
        allowNull: true // Optional link to a specific project
    },
    assigned_to_id: {
        type: DataTypes.UUID,
        allowNull: true // Staff member assigned to this ticket
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('new', 'open', 'in_progress', 'resolved', 'closed'),
        defaultValue: 'new'
    },
    priority: {
        type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
        defaultValue: 'normal'
    },
    source_website: {
        // Источник: с какого сайта (домена) был отправлен тикет
        type: DataTypes.STRING,
        allowNull: true
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'support_tickets',
    timestamps: true,
    paranoid: true, // Soft deletes
});

module.exports = SupportTicket;
