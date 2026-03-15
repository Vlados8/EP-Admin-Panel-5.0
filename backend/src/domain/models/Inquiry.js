const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Inquiry = sequelize.define('Inquiry', {
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
        allowNull: true, // Can be null if it's a new lead not yet saved as a client
    },
    project_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // E.g. The ID of 'Photovoltaik' or 'Wärmepumpe'
    },
    subcategory_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact_email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contact_phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true // e.g. address or zip code
    },
    status: {
        type: DataTypes.ENUM('new', 'contacted', 'qualified', 'proposal', 'won', 'lost'),
        defaultValue: 'new'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    source_website: {
        // Источник: с какого сайта (домена) пришел запрос (например, landing-pv.de)
        type: DataTypes.STRING,
        allowNull: true
    },
    source_ip: {
        // IP-адрес отправителя
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'inquiries',
    timestamps: true,
    paranoid: true,
});

module.exports = Inquiry;
