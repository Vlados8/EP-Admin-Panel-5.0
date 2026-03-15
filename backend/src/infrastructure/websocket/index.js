const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const redisClient = require('../../config/redis');
const logger = require('../../utils/logger');

let io;

const initWebSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*', // Configure properly in production
            methods: ['GET', 'POST']
        }
    });

    // Setup Redis Adapter for scaling across multiple Node instances
    const pubClient = redisClient.duplicate();
    const subClient = redisClient.duplicate();

    let pubSubErrorLogged = false;
    pubClient.on('error', (err) => {
        if (!pubSubErrorLogged) {
            logger.error(`Redis PubClient Error: ${err.message}. Suppressing further connection errors.`);
            pubSubErrorLogged = true;
        }
    });

    subClient.on('error', (err) => {
        if (!pubSubErrorLogged) {
            logger.error(`Redis SubClient Error: ${err.message}. Suppressing further connection errors.`);
            pubSubErrorLogged = true;
        }
    });

    io.adapter(createAdapter(pubClient, subClient));

    io.use((socket, next) => {
        // Placeholder for WebSocket Authentication
        // const token = socket.handshake.auth.token;
        // if (isValid(token)) { ... }

        // For now, attaching dummy companyId to socket for scoping
        socket.companyId = socket.handshake.query.companyId || 'default_company';
        socket.userId = socket.handshake.query.userId || 'anonymous';
        next();
    });

    io.on('connection', (socket) => {
        logger.info(`New WebSocket Connection: ${socket.id} (User: ${socket.userId})`);

        // Join Company Room for global company notifications
        if (socket.companyId) {
            socket.join(`company_${socket.companyId}`);
            logger.debug(`Socket ${socket.id} joined room: company_${socket.companyId}`);
        }

        socket.on('join_project', (projectId) => {
            socket.join(`project_${projectId}`);
            logger.debug(`Socket ${socket.id} joined project room: project_${projectId}`);
        });

        socket.on('leave_project', (projectId) => {
            socket.leave(`project_${projectId}`);
            logger.debug(`Socket ${socket.id} left project room: project_${projectId}`);
        });

        socket.on('disconnect', () => {
            logger.info(`WebSocket Disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io has not been initialized!');
    }
    return io;
};

// Notification Helper
const emitToCompany = (companyId, event, data) => {
    if (io) {
        io.to(`company_${companyId}`).emit(event, data);
    }
};

const emitToProject = (projectId, event, data) => {
    if (io) {
        io.to(`project_${projectId}`).emit(event, data);
    }
};

module.exports = {
    initWebSocket,
    getIO,
    emitToCompany,
    emitToProject
};
