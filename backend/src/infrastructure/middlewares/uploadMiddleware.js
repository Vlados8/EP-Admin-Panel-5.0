const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

/**
 * Creates a Multer storage engine for a specific subfolder within 'uploads'
 * @param {string} folder - Subfolder name (e.g., 'notizen', 'tasks')
 */
const createStorage = (folder) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            // Corrected to 4 levels up to reach project root 'admin' from 'backend/src/infrastructure/middlewares'
            const uploadPath = path.join(__dirname, '../../../../uploads', folder);
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            // Use UUID-like prefix + original extension for uniqueness as requested
            const uniqueId = crypto.randomUUID();
            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '_').toLowerCase();
            cb(null, `${uniqueId}_${name}${ext}`);
        }
    });
};

/**
 * Returns a Multer instance for a specific task area
 * @param {string} area - One of 'notizen' or 'tasks'
 */
const getUploader = (area) => {
    return multer({
        storage: createStorage(area),
        limits: {
            fileSize: 100 * 1024 * 1024 // 100MB limit
        }
    });
};

module.exports = { getUploader };
