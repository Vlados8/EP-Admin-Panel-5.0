require('dotenv').config();
const { sequelize } = require('./src/domain/models');

async function syncAlter() {
    try {
        await sequelize.authenticate();
        console.log('Connection established.');
        await sequelize.sync({ alter: true });
        console.log('Database synced with alter:true');
        process.exit(0);
    } catch (error) {
        console.error('Sync failed:', error);
        process.exit(1);
    }
}

syncAlter();
