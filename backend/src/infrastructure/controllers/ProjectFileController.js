const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { ProjectFolder, Role, Project } = require('../../domain/models');

// Base uploads directory
const UPLOADS_DIR = path.join(__dirname, '../../../../uploads/projects');

// Temporary storage for incoming uploads before moving them
const upload = multer({ dest: path.join(__dirname, '../../../../uploads/temp/') });

// Utility func to ensure requested path is secure and within project dir
const getSecurePath = (projectId, requestedPath) => {
    if (!projectId) throw new Error('Project ID is required');

    const projectDir = path.join(UPLOADS_DIR, String(projectId));
    // Resolve absolute path and prevent directory traversal
    const targetPath = path.resolve(projectDir, requestedPath || '');

    // The target path MUST start with the projectDir
    if (!targetPath.startsWith(projectDir)) {
        throw new Error('Access denied: Invalid path');
    }

    return { projectDir, targetPath };
};

// Ensure project directory exists
const ensureProjectDir = (projectDir) => {
    if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
    }
};

exports.listFiles = async (req, res) => {
    try {
        const { id } = req.params;
        const subPath = req.query.path || '';
        const userRole = req.user.role; // Assuming auth middleware sets req.user

        const { projectDir, targetPath } = getSecurePath(id, subPath);
        ensureProjectDir(projectDir);

        if (!fs.existsSync(targetPath)) {
            return res.status(404).json({ error: 'Directory not found' });
        }

        // 1. Check if the current folder itself is restricted
        const folderParts = subPath.split('/').filter(Boolean);
        const currentFolderName = folderParts[folderParts.length - 1] || '';
        const parentPath = folderParts.slice(0, -1).join('/');

        if (subPath) {
            const currentFolderRecord = await ProjectFolder.findOne({
                where: { project_id: id, path: parentPath, name: currentFolderName }
            });

            if (currentFolderRecord && currentFolderRecord.allowed_role_ids) {
                const allowedRoles = Array.isArray(currentFolderRecord.allowed_role_ids) 
                    ? currentFolderRecord.allowed_role_ids 
                    : JSON.parse(currentFolderRecord.allowed_role_ids);
                
                // Admin and Büro always see everything
                const isManagement = ['Admin', 'Büro'].includes(userRole.name);
                
                if (!isManagement && !allowedRoles.includes(userRole.id)) {
                    return res.status(403).json({ error: 'Access denied: You do not have permission to view this folder' });
                }
            }
        }

        // 2. Read FS items
        const items = fs.readdirSync(targetPath, { withFileTypes: true });

        const folderRecords = await ProjectFolder.findAll({
            where: { project_id: id, path: subPath }
        });

        // Helper to fix garbled filenames (UTF-8 bytes misinterpreted as Latin-1)
        const fixEncoding = (str) => {
            if (!str) return str;
            try {
                // Pre-normalize common misinterpretations/normalization: 
                // Ð/Ñ (Latin-1 D0/D1) often become Đ/đ (U+0110/U+0111)
                const normalized = str.replace(/\u0110/g, '\u00D0').replace(/\u0111/g, '\u00D1');
                const buf = Buffer.from(normalized, 'latin1');
                const utf8 = buf.toString('utf8');
                
                // Heuristic: If it contains Cyrillic characters now and didn't before, it's fixed.
                // Also check if it's generally valid UTF-8 without replacement chars.
                const hasCyrillic = /[\u0400-\u04FF]/.test(utf8);
                const isProbablyCorrect = hasCyrillic || (utf8 !== normalized && !utf8.includes('\ufffd'));
                
                return isProbablyCorrect ? utf8 : str;
            } catch {
                return str;
            }
        };

        const formattedItems = items.map(item => {
            const itemPath = path.join(targetPath, item.name);
            const stats = fs.statSync(itemPath);
            const relativePath = path.relative(UPLOADS_DIR, itemPath).replace(/\\/g, '/');

            // Find metadata for this specific directory if it exists
            const record = item.isDirectory() 
                ? folderRecords.find(r => r.name === item.name) 
                : null;

            return {
                name: fixEncoding(item.name),
                physicalName: item.name, // Keep original for reference
                isDirectory: item.isDirectory(),
                size: stats.size,
                createdAt: stats.birthtime,
                updatedAt: stats.mtime,
                url: item.isDirectory() ? null : `/uploads/projects/${relativePath}`,
                permissions: record ? {
                    allowed_role_ids: record.allowed_role_ids,
                    is_public: record.is_public,
                    share_token: record.share_token
                } : null
            };
        });

        // 4. Filter items based on permissions
        const filteredItems = formattedItems.filter(item => {
            // Admin and Büro bypass filtering
            if (['Admin', 'Büro'].includes(userRole.name)) return true;

            if (!item.isDirectory || !item.permissions || !item.permissions.allowed_role_ids) return true;
            
            const allowedRoles = Array.isArray(item.permissions.allowed_role_ids)
                ? item.permissions.allowed_role_ids
                : JSON.parse(item.permissions.allowed_role_ids);

            return allowedRoles.includes(userRole.id);
        });

        // Optional: Sort so directories come first
        filteredItems.sort((a, b) => {
            if (a.isDirectory === b.isDirectory) {
                return a.name.localeCompare(b.name);
            }
            return a.isDirectory ? -1 : 1;
        });

        res.status(200).json({
            status: 'success',
            data: filteredItems
        });
    } catch (error) {
        console.error('Error listing files:', error);
        res.status(400).json({ error: error.message || 'Server error reading directory' });
    }
};

exports.createFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const { path: folderPath, name, allowed_role_ids } = req.body;

        if (!name) return res.status(400).json({ error: 'Folder name is required' });

        // Fix potential encoding issues from body-parser/client
        const sanitizedName = Buffer.from(name, 'latin1').toString('utf8');

        const { projectDir, targetPath } = getSecurePath(id, folderPath);
        ensureProjectDir(projectDir);

        const newFolderPath = path.join(targetPath, sanitizedName);

        if (fs.existsSync(newFolderPath)) {
            return res.status(400).json({ error: 'Folder already exists' });
        }

        fs.mkdirSync(newFolderPath, { recursive: true });

        // Save metadata to DB
        await ProjectFolder.create({
            project_id: id,
            name: sanitizedName,
            path: folderPath || '',
            allowed_role_ids: allowed_role_ids || null
        });

        res.status(201).json({
            status: 'success',
            message: 'Folder created successfully'
        });
    } catch (error) {
        console.error('Error creating folder:', error);
        res.status(400).json({ error: error.message || 'Server error creating folder' });
    }
};

// Multer middleware wrapper for file uploads
exports.uploadMiddleware = upload.array('files');

exports.uploadFiles = async (req, res) => {
    try {
        const { id } = req.params;
        const uploadPath = req.body.path || '';

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const { projectDir, targetPath } = getSecurePath(id, uploadPath);
        ensureProjectDir(projectDir);

        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
        }

        const uploadedFiles = [];

        req.files.forEach(file => {
            // Fix encoding: multer/busboy misinterprets UTF-8 as Latin-1
            let fileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
            let finalPath = path.join(targetPath, fileName);

            if (fs.existsSync(finalPath)) {
                const ext = path.extname(fileName);
                const name = path.basename(fileName, ext);
                fileName = `${name}_${Date.now()}${ext}`;
                finalPath = path.join(targetPath, fileName);
            }

            // Move from temp storage to final target
            fs.renameSync(file.path, finalPath);

            const relativePath = path.relative(UPLOADS_DIR, finalPath).replace(/\\/g, '/');
            uploadedFiles.push({
                name: fileName,
                url: `/uploads/projects/${relativePath}`
            });
        });

        res.status(201).json({
            status: 'success',
            message: 'Files uploaded successfully',
            data: uploadedFiles
        });
    } catch (error) {
        // Cleanup temp files on error
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        }

        console.error('Error uploading files:', error);
        res.status(400).json({ error: error.message || 'Server error uploading files' });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const itemPath = req.query.path;

        if (!itemPath) return res.status(400).json({ error: 'Path is required for deletion' });

        const { targetPath } = getSecurePath(id, itemPath);

        if (!fs.existsSync(targetPath)) {
            return res.status(404).json({ error: 'File or folder not found' });
        }

        const stats = fs.statSync(targetPath);

        if (stats.isDirectory()) {
            // Delete directory recursively
            fs.rmSync(targetPath, { recursive: true, force: true });
        } else {
            // Delete file
            fs.unlinkSync(targetPath);
        }

        res.status(200).json({
            status: 'success',
            message: 'Item deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(400).json({ error: error.message || 'Server error deleting item' });
    }
};

exports.downloadFile = async (req, res) => {
    try {
        const { id } = req.params;
        const itemPath = req.query.path;

        if (!itemPath) return res.status(400).json({ error: 'Path is required for download' });

        const { targetPath } = getSecurePath(id, itemPath);

        if (!fs.existsSync(targetPath)) {
            // Smart fallback for garbled names
            const dir = path.dirname(targetPath);
            const base = path.basename(targetPath);
            const garbledBase = Buffer.from(base, 'utf8').toString('latin1');
            const garbledPath = path.join(dir, garbledBase);

            if (fs.existsSync(garbledPath)) {
                return res.download(garbledPath);
            }
            return res.status(404).json({ error: 'File not found' });
        }

        const stats = fs.statSync(targetPath);
        if (stats.isDirectory()) {
            return res.status(400).json({ error: 'Cannot directly download a directory' });
        }

        res.download(targetPath);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(400).json({ error: error.message || 'Server error downloading file' });
    }
};

exports.updatePermissions = async (req, res) => {
    try {
        const { id } = req.params;
        const { path: folderPath, name, allowed_role_ids } = req.body;
        const userRole = req.user.role;

        // Restriction: Only Admin, Büro, and Projektleiter can change permissions
        const allowedToManage = ['Admin', 'Büro', 'Projektleiter'].includes(userRole.name);
        if (!allowedToManage) {
            return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
        }

        const [folder, created] = await ProjectFolder.findOrCreate({
            where: { project_id: id, path: folderPath || '', name: name },
            defaults: { allowed_role_ids }
        });

        if (!created) {
            folder.allowed_role_ids = allowed_role_ids;
            await folder.save();
        }

        res.status(200).json({ status: 'success', message: 'Permissions updated' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.togglePublicShare = async (req, res) => {
    try {
        const { id } = req.params;
        const { path: folderPath, name } = req.body;
        const userRole = req.user.role;

        // Restriction: Only Admin, Büro, and Projektleiter can manage links
        const allowedToManage = ['Admin', 'Büro', 'Projektleiter'].includes(userRole.name);
        if (!allowedToManage) {
            return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
        }

        const [folder] = await ProjectFolder.findOrCreate({
            where: { project_id: id, path: folderPath || '', name: name }
        });

        folder.is_public = !folder.is_public;
        await folder.save();

        res.status(200).json({ 
            status: 'success', 
            is_public: folder.is_public,
            share_token: folder.share_token
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
