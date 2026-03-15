const jwt = require('jsonwebtoken');
const { User, Role, Company, ApiKey } = require('../../domain/models');
const AppError = require('../../utils/appError');

/**
 * Flexible Authentification Middleware
 * Allows both JWT (Admin Panel) and API Key (External Websites).
 */
module.exports = async (req, res, next) => {
    try {
        let authHeader = req.headers.authorization;
        let apiKey = req.headers['x-api-key'];
        
        // 1. Check for JWT first (Normal User Flow)
        if (authHeader && authHeader.startsWith('Bearer ')) {
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
                }
            } catch (jwtErr) {
                // If it's not a valid JWT, it might be an API Key passed as Bearer token
                // We'll fall through to API Key check
            }
        }

        // 2. Check for API Key (External Site Flow)
        let keyToVerify = apiKey;
        if (!keyToVerify && authHeader && authHeader.startsWith('Bearer ')) {
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
                req.body.company_id = apiKeyRecord.company_id;
                return next();
            }
        }

        // 3. Fallback: Unauthorized
        return next(new AppError('No valid authentication provided (JWT or API Key required)', 401));
    } catch (err) {
        next(err);
    }
};
