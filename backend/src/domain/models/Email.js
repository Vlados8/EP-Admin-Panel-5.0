const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Email = sequelize.define('Email', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    mailgun_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'ID assigned by Mailgun'
    },
    sender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sender_name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Friendly name of the sender'
    },
    sender_email: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Clean email address extracted from sender'
    },
    recipient: {
        type: DataTypes.STRING,
        allowNull: false
    },
    recipient_name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Friendly name of the recipient'
    },
    recipient_email: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Clean email address extracted from recipient'
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'clients',
            key: 'id'
        }
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: true
    },
    body_html: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    body_plain: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    received_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    company_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    direction: {
        type: DataTypes.ENUM('inbound', 'outbound'),
        defaultValue: 'inbound'
    }
}, {
    tableName: 'emails',
    timestamps: true,
    underscored: true,
    paranoid: true
});

module.exports = Email;
