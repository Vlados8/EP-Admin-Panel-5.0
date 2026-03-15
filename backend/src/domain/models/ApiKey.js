const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const ApiKey = sequelize.define('ApiKey', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    company_id: {
        // ID компании, к которой привязан ключ (обычно ваша основная компания)
        type: DataTypes.UUID,
        allowNull: false
    },
    created_by_id: {
        // Пользователь, который сгенерировал ключ
        type: DataTypes.UUID,
        allowNull: true
    },
    key_hash: {
        // Хэш самого ключа (ради безопасности не храним ключ в открытом виде)
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name_or_domain: {
        // Имя сайта/воронки (например, "ep-construction.de")
        type: DataTypes.STRING,
        allowNull: false
    },
    is_active: {
        // Статус ключа: актвиен или отозван
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    last_used_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    last_used_ip: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'api_keys',
    timestamps: true,
    paranoid: true, // Soft deletes
});

/**
 * Вспомогательный метод для генерации ключа
 * Возвращает { rawKey, hashedKey }
 */
ApiKey.generateKey = function () {
    const rawKey = `ep_${crypto.randomBytes(24).toString('hex')}`;
    const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');
    return { rawKey, hashedKey };
};

/**
 * Вспомогательный метод для хэширования входящего ключа для сравнения
 */
ApiKey.hashKey = function (rawKey) {
    if (!rawKey) return null;
    return crypto.createHash('sha256').update(rawKey).digest('hex');
};

module.exports = ApiKey;
