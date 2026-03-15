const fs = require('fs');
const path = require('path');
const multer = require('multer');

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

        const { projectDir, targetPath } = getSecurePath(id, subPath);
        ensureProjectDir(projectDir);

        if (!fs.existsSync(targetPath)) {
            return res.status(404).json({ error: 'Directory not found' });
        }

        const items = fs.readdirSync(targetPath, { withFileTypes: true });

        const formattedItems = items.map(item => {
            const itemPath = path.join(targetPath, item.name);
            const stats = fs.statSync(itemPath);
            const relativePath = path.relative(UPLOADS_DIR, itemPath).replace(/\\/g, '/');

            return {
                name: item.name,
                isDirectory: item.isDirectory(),
                size: stats.size,
                createdAt: stats.birthtime,
                updatedAt: stats.mtime,
                url: item.isDirectory() ? null : `/uploads/projects/${relativePath}`
            };
        });

        // Optional: Sort so directories come first
        formattedItems.sort((a, b) => {
            if (a.isDirectory === b.isDirectory) {
                return a.name.localeCompare(b.name);
            }
            return a.isDirectory ? -1 : 1;
        });

        res.status(200).json({
            status: 'success',
            data: formattedItems
        });
    } catch (error) {
        console.error('Error listing files:', error);
        res.status(400).json({ error: error.message || 'Server error reading directory' });
    }
};

exports.createFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const { path: folderPath, name } = req.body;

        if (!name) return res.status(400).json({ error: 'Folder name is required' });

        const { projectDir, targetPath } = getSecurePath(id, folderPath);
        ensureProjectDir(projectDir);

        const newFolderPath = path.join(targetPath, name);

        if (fs.existsSync(newFolderPath)) {
            return res.status(400).json({ error: 'Folder already exists' });
        }

        fs.mkdirSync(newFolderPath, { recursive: true });

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
            // Check for duplicate names and append timestamp if needed
            let fileName = file.originalname;
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
