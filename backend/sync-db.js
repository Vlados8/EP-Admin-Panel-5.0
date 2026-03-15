require('dotenv').config();
const { sequelize } = require('./src/domain/models');
const logger = require('./src/utils/logger');

async function syncDb() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        // Force true drops existing tables and recreates them
        await sequelize.sync({ force: true });
        console.log('Database reconstructed with force:true');
        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

syncDb();
