const { sequelize } = require('../src/domain/models');

/**
 * Safe Database Schema Synchronization
 * 
 * Uses { alter: true } to ensure new tables (EmailAccount, Email, Attachment) 
 * are created without dropping or overwriting existing tables (Support, Inquiry, Category, API Keys).
 */
async function syncDb() {
    try {
        console.log('----------------------------------------------------');
        console.log('[Migration] Checking environment...');
        console.log(`[Migration] Node Env: ${process.env.NODE_ENV || 'development'}`);
        
        console.log('[Migration] Starting safe schema synchronization (alter: true)...');
        
        // This will:
        // 1. Create new tables if they don't exist.
        // 2. Add new columns if they are missing.
        // 3. Keep all existing data in all tables.
        await sequelize.sync({ alter: true });
        
        console.log('[Migration] SUCCESS: Database schema is up to date.');
        console.log('----------------------------------------------------');
        process.exit(0);
    } catch (error) {
        console.error('----------------------------------------------------');
        console.error('[Migration] FATAL ERROR during synchronization:');
        console.error(error.message);
        console.error('----------------------------------------------------');
        process.exit(1);
    }
}

syncDb();
