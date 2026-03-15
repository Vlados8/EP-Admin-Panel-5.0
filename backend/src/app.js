require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const path = require('path');
require('./config/redis'); // Initialize Redis connection

// Express App Intialization
const app = express();

// Enable trust proxy for correct IP detection on hosting (e.g., Railway)
app.set('trust proxy', 1);

// Middlewares
app.use(helmet());
app.use(cors({ origin: '*' }));

// Healthcheck Route (Top priority for Railway)
app.get('/api/v1/health', async (req, res) => {
    const sequelize = require('./config/database');
    const fs = require('fs');
    const path = require('path');
    
    let dbStatus = 'connected';
    try {
        await sequelize.authenticate();
    } catch (err) {
        dbStatus = 'connecting/error';
    }

    const infrastructurePath = path.join(__dirname, 'infrastructure');
    let dirSnapshot = {};
    try {
        if (fs.existsSync(infrastructurePath)) {
            const subdirs = fs.readdirSync(infrastructurePath);
            subdirs.forEach(sd => {
                const fullSdPath = path.join(infrastructurePath, sd);
                if (fs.statSync(fullSdPath).isDirectory()) {
                    dirSnapshot[sd] = fs.readdirSync(fullSdPath);
                }
            });
        } else {
            dirSnapshot = 'INFRASTRUCTURE_MISSING';
        }
    } catch (err) {
        dirSnapshot = 'DIR_ERROR: ' + err.message;
    }

    res.status(200).json({
        status: 'success',
        database: dbStatus,
        filesystem: dirSnapshot,
        timestamp: new Date().toISOString()
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Request Logging Middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    next();
});

// Global Rate Limit (Disabled in dev to avoid 429 errors while testing)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000,               // Limit each IP to 10k requests for dev
});
app.use(limiter);

// Healthcheck is now at the top

// Import Routes
console.log('--- ROUTE RESOLUTION CHECK ---');
console.log('__dirname:', __dirname);
const apiKeyRoutesPath = path.join(__dirname, 'infrastructure/routes/api-key.routes.js');
console.log('Target Path:', apiKeyRoutesPath);

// Mount Routes (Wrapped in try/catch for Railway debugging)
try {
    const authRoutes = require('./infrastructure/routes/authRoutes');
    const userRoutes = require('./infrastructure/routes/userRoutes');
    const roleRoutes = require('./infrastructure/routes/roleRoutes');
    const noteRoutes = require('./infrastructure/routes/noteRoutes');
    const taskRoutes = require('./infrastructure/routes/taskRoutes');
    const subcontractorRoutes = require('./infrastructure/routes/subcontractorRoutes');
    const clientRoutes = require('./infrastructure/routes/clientRoutes');
    const categoryRoutes = require('./infrastructure/routes/categoryRoutes');
    const inquiryRoutes = require('./infrastructure/routes/inquiryRoutes');
    const projectRoutes = require('./infrastructure/routes/projectRoutes');
    const supportRoutes = require('./infrastructure/routes/supportRoutes');

    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/roles', roleRoutes);
    app.use('/api/v1/notes', noteRoutes);
    app.use('/api/v1/tasks', taskRoutes);
    app.use('/api/v1/subcontractors', subcontractorRoutes);
    app.use('/api/v1/clients', clientRoutes);
    app.use('/api/v1/categories', categoryRoutes);
    app.use('/api/v1/inquiries', inquiryRoutes);
    app.use('/api/v1/projects', projectRoutes);
    app.use('/api/v1/project-stages', require('./infrastructure/routes/projectStageRoutes'));
    app.use('/api/v1/support', supportRoutes);
    
    // The problematic route
    const apiKeyRoutes = require(apiKeyRoutesPath);
    app.use('/api/v1/api-keys', apiKeyRoutes);
    
} catch (err) {
    console.error('CRITICAL: Route initialization failed:', err.message);
    app.use('/api/v1', (req, res) => {
        res.status(500).json({ 
            status: 'error', 
            message: 'API is partially unavailable due to module resolution issues.',
            error: err.message
        });
    });
}

// --- Serve Frontend in Production ---
if (process.env.NODE_ENV === 'production') {
    const frontendDist = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendDist));

    app.get(/.*/, (req, res) => {
        // Fallback for SPA routing - Ignore API requests
        if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
            return res.status(404).json({ status: 'fail', message: 'Not found' });
        }
        res.sendFile(path.join(frontendDist, 'index.html'));
    });
}
// ------------------------------------

// Centralized Error Handling Placeholder
app.use((err, req, res, next) => {
    logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    logger.error(err.stack);

    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 3000;
const http = require('http');
const { initWebSocket } = require('./infrastructure/websocket');

console.log('--- BACKEND BOOTSTRAP STARTING ---');

if (require.main === module) {
    (async () => {
        const server = http.createServer(app);

        // Initialize WebSockets
        initWebSocket(server);

        // Import all models
        require('./domain/models');

        const PORT = process.env.PORT || 3000;
        
        // Start listening IMMEDIATELY so Railway healthcheck finds an open port
        server.listen(PORT, '0.0.0.0', async () => {
            console.log(`Server is now listening on port ${PORT}`);
            logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);

            // Perform DB sync/seed in background/after listen
            const sequelize = require('./config/database');
            const seedDatabase = require('./infrastructure/database/seeder');
            try {
                console.log('Connecting to database and synchronizing...');
                await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
                console.log('Database synchronized successfully.');

                console.log('Running initial seeding...');
                await seedDatabase();
                console.log('Initial seeding check finished.');
            } catch (err) {
                console.error('CRITICAL: Failed to sync/seed database:', err.message);
                // Keep the server running so we can still access it for debugging
            }
        });
    })();
}

module.exports = app;
