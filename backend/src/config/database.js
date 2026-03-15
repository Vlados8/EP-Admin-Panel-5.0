const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

const sequelize = dbUrl
    ? new Sequelize(dbUrl, {
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        define: {
            timestamps: true,
            underscored: true,
            paranoid: true,
        }
    })
    : new Sequelize(
        process.env.DB_NAME || process.env.MYSQLDATABASE,
        process.env.DB_USER || process.env.MYSQLUSER,
        process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
        {
            host: process.env.DB_HOST || process.env.MYSQLHOST,
            port: process.env.DB_PORT || process.env.MYSQLPORT,
            dialect: 'mysql',
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            define: {
                timestamps: true,
                underscored: true,
                paranoid: true,
            }
        }
    );

module.exports = sequelize;
