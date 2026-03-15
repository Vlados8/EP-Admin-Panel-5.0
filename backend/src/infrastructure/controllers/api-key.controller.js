const { ApiKey, User, Company } = require('../../domain/models');
const AppError = require('../../utils/appError');

// Получить все API ключи компании
exports.getAllKeys = async (req, res, next) => {
    try {
        const companyId = req.user?.company_id; // Предполагая, что auth middleware устанавливает req.user
        
        let query = {};
        if (companyId) {
            query.company_id = companyId;
        }

        const keys = await ApiKey.findAll({
            where: query,
            include: [
                { model: User, as: 'created_by', attributes: ['id', 'name', 'email'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Возвращаем ключи (без оригинальных хэшей для безопасности)
        const safeKeys = keys.map(k => {
            const kl = k.toJSON();
            delete kl.key_hash; 
            return kl;
        });

        res.status(200).json({
            status: 'success',
            data: { keys: safeKeys }
        });
    } catch (err) {
        next(err);
    }
};

// Создать новый API ключ
exports.createKey = async (req, res, next) => {
    try {
        const { name_or_domain, company_id } = req.body;
        
        if (!name_or_domain) {
            return next(new AppError('Поле name_or_domain (Домен или название) обязательно', 400));
        }

        let targetCompanyId = company_id || req.user?.company_id;
        
        // Фолбэк для одиночной компании
        if (!targetCompanyId) {
            const company = await Company.findOne();
            if (company) targetCompanyId = company.id;
        }

        if (!targetCompanyId) {
             return next(new AppError('ID компании обязательно', 400));
        }

        const { rawKey, hashedKey } = ApiKey.generateKey();

        const newKey = await ApiKey.create({
            company_id: targetCompanyId,
            created_by_id: req.user?.id || null, // Если пользователь авторизован
            key_hash: hashedKey,
            name_or_domain: name_or_domain,
            is_active: true
        });

        // Важно: возвращаем rawKey ТОЛЬКО ОДИН РАЗ при создании!
        res.status(201).json({
            status: 'success',
            message: 'Ключ успешно сгенерирован. Сохраните его, он больше не будет показан.',
            data: { 
                apiKey: rawKey,
                keyDetails: {
                    id: newKey.id,
                    name_or_domain: newKey.name_or_domain,
                    is_active: newKey.is_active,
                    createdAt: newKey.createdAt
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

// Отозвать/Деактивировать ключ
exports.revokeKey = async (req, res, next) => {
    try {
        const key = await ApiKey.findByPk(req.params.id);
        
        if (!key) {
            return next(new AppError('API ключ не найден', 404));
        }

        // Проверка прав (если нужно)
        if (req.user?.company_id && key.company_id !== req.user.company_id) {
             return next(new AppError('У вас нет прав на деактивацию этого ключа', 403));
        }

        key.is_active = false;
        await key.save();

        res.status(200).json({
            status: 'success',
            message: 'API ключ отозван'
        });
    } catch (err) {
        next(err);
    }
};

// Удалить ключ полностью
exports.deleteKey = async (req, res, next) => {
    try {
        const key = await ApiKey.findByPk(req.params.id);
        
        if (!key) {
            return next(new AppError('API ключ не найден', 404));
        }

         // Проверка прав 
        if (req.user?.company_id && key.company_id !== req.user.company_id) {
             return next(new AppError('У вас нет прав на удаление этого ключа', 403));
        }

        await key.destroy();

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
}
