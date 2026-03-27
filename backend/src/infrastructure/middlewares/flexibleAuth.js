const jwt = require('jsonwebtoken');
const { User, Role, Company, ApiKey } = require('../../domain/models');
const AppError = require('../../utils/appError');

/**
 * Flexible Authentification Middleware
 * Allows both JWT (Admin Panel) and API Key (External Websites).
 */
module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const apiKey = req.headers['x-api-key'];

        // Ensure req.body exists (helpful for GET requests or when body-parser hasn't run)
        if (!req.body) req.body = {};
        
        // 1. Check for JWT first (Normal User Flow)
        if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
            const token = authHeader.split(' ')[1];
            
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const currentUser = await User.findByPk(decoded.id, {
                    include: [
                        { model: Role, as: 'role' },
                        { model: Company, as: 'company' }
                    ]
                });

                if (currentUser) {
                    req.user = currentUser;
                    // For controllers that expect body.company_id from middleware
                    if (!req.body.company_id) {
                        req.body.company_id = currentUser.company_id;
                    }
                    return next();
                } else {
                    console.log(`[flexibleAuth] User not found for ID: ${decoded.id}`);
                }
            } catch (jwtErr) {
                // If it's not a valid JWT, it might be an API Key passed as Bearer token
                // Log only if it's not a common "expired" or "malformed" error that we expect from external sites
                if (jwtErr.name !== 'JsonWebTokenError' && jwtErr.name !== 'TokenExpiredError') {
                    console.error('[flexibleAuth] JWT Verification Error:', jwtErr.message);
                }
            }
        }

        // 2. Check for API Key (External Site Flow)
        let keyToVerify = apiKey;
        if (!keyToVerify && authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
            keyToVerify = authHeader.split(' ')[1];
        }

        if (keyToVerify) {
            const hashedKey = ApiKey.hashKey(keyToVerify);
            const apiKeyRecord = await ApiKey.findOne({
                where: { key_hash: hashedKey, is_active: true }
            });

            if (apiKeyRecord) {
                // Update usage stats
                apiKeyRecord.last_used_at = new Date();
                apiKeyRecord.last_used_ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || req.socket.remoteAddress;
                await apiKeyRecord.save();

                req.source_website = apiKeyRecord.name_or_domain;
                req.apiKey = apiKeyRecord; // Сохраняем объект ключа для дальнейшей фильтрации
                req.body.company_id = apiKeyRecord.company_id;
                return next();
            } else {
                console.log(`[flexibleAuth] Invalid or inactive API Key: ${keyToVerify.substring(0, 8)}...`);
            }
        }

        // 3. Fallback: Unauthorized
        console.log(`[flexibleAuth] Unauthorized access attempt to ${req.originalUrl} from ${req.ip}`);
        return next(new AppError('No valid authentication provided (JWT or API Key required)', 401));
    } catch (err) {
        console.error('[flexibleAuth] Critical middleware error:', err);
        next(err);
    }
};
