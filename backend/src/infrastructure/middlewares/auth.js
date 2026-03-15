const jwt = require('jsonwebtoken');
const { User, Role, Company } = require('../../domain/models');
const AppError = require('../../utils/appError');

/**
 * Middleware для защиты маршрутов с использованием JWT.
 * Проверяет наличие токена, его валидность и существование пользователя.
 */
exports.protect = async (req, res, next) => {
    try {
        let token;
        
        // 1. Получение токена из заголовков
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('Вы не авторизованы. Пожалуйста, войдите в систему.', 401));
        }

        // 2. Верификация токена
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Проверка, существует ли пользователь
        const currentUser = await User.findByPk(decoded.id, {
            include: [
                { model: Role, as: 'role' },
                { model: Company, as: 'company' }
            ]
        });

        if (!currentUser) {
            return next(new AppError('Пользователь, которому принадлежит этот токен, больше не существует.', 401));
        }

        // 4. Сохранение пользователя в объекте запроса
        req.user = currentUser;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return next(new AppError('Невалидный токен. Пожалуйста, войдите снова.', 401));
        }
        if (err.name === 'TokenExpiredError') {
            return next(new AppError('Ваш токен истек. Пожалуйста, войдите снова.', 401));
        }
        next(err);
    }
};

/**
 * Middleware для ограничения доступа по ролям.
 * @param  {...string} roles - Список разрешенных ролей (slugs)
 */
exports.restrictTo = (...roles) => {
    const lowerRoles = roles.map(r => r.toLowerCase());
    return (req, res, next) => {
        // Проверка: есть ли у пользователя роль и входит ли её имя в список разрешенных (в нижнем регистре)
        if (!req.user.role || !lowerRoles.includes(req.user.role.name.toLowerCase())) {
            return next(new AppError('У вас нет прав на выполнение этого действия.', 403));
        }
        next();
    };
};
