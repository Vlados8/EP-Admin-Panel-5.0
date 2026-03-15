const { ApiKey } = require('../../domain/models');
const AppError = require('../../utils/appError');

/**
 * Middleware для защиты API endpoint'ов с помощью API Key.
 * Ожидает ключ в заголовке `x-api-key` или `Authorization: Bearer <key>`.
 */
module.exports = exports.verifyApiKey = async (req, res, next) => {
    try {
        let key = req.headers['x-api-key'];

        // Фолбэк на Authorization заголовок, если необходимо
        if (!key && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            key = req.headers.authorization.split(' ')[1];
        }

        if (!key) {
            return next(new AppError('API key is missing', 401));
        }

        // Хэшируем полученный ключ для сравнения с БД
        const hashedKey = ApiKey.hashKey(key);

        const apiKeyRecord = await ApiKey.findOne({
            where: {
                key_hash: hashedKey,
                is_active: true
            }
        });

        if (!apiKeyRecord) {
            return next(new AppError('Invalid or inactive API key', 401));
        }

        // Обновляем время и IP использования
        apiKeyRecord.last_used_at = new Date();
        apiKeyRecord.last_used_ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || req.socket.remoteAddress;
        await apiKeyRecord.save();

        // Прикрепляем данные об источнике к объекту запроса, чтобы контроллеры могли их использовать
        req.source_website = apiKeyRecord.name_or_domain;
        
        // В продакшене вы также можете прикрепить company_id из ключа к запросу,
        // чтобы гарантировать, что данные падают в правильную компанию (мультитенантность)
        req.body.company_id = apiKeyRecord.company_id;

        next();
    } catch (error) {
        next(new AppError('Internal server error during API key verification', 500));
    }
};
