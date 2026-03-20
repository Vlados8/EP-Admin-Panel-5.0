const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const EmailAccount = sequelize.define('EmailAccount', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    company_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    mailgun_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'ID or reference in Mailgun (e.g., Route ID or Credential)'
    },
    type: {
        type: DataTypes.ENUM('forward', 'smtp'),
        defaultValue: 'forward',
        comment: 'Forward (Route) or SMTP Credential'
    },
    forward_to: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Address to forward to if type is forward'
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'pending'),
        defaultValue: 'active'
    },
    last_checked_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Assigned user, null if shared'
    },
    is_shared: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'If true, everyone in the company can access it'
    },
    display_name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Display name for the email (e.g., "Support", "Info")'
    }
}, {
    tableName: 'email_accounts',
    timestamps: true,
    paranoid: true
});

module.exports = EmailAccount;
