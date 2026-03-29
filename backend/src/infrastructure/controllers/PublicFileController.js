const fs = require('fs');
const path = require('path');
const { ProjectFolder, Project, Client } = require('../../domain/models');

const UPLOADS_DIR = path.join(__dirname, '../../../../uploads/projects');

exports.getSharedFolder = async (req, res) => {
    try {
        const { token } = req.params;
        const subPath = req.query.path || '';

        const folder = await ProjectFolder.findOne({
            where: { share_token: token, is_public: true },
            include: [{
                model: Project,
                as: 'project',
                include: [{
                    model: Client,
                    as: 'client'
                }]
            }]
        });

        if (!folder) {
            return res.status(404).json({ error: 'Shared folder not found or access disabled' });
        }

        const projectDir = path.join(UPLOADS_DIR, String(folder.project_id));
        const rootSharedPath = path.resolve(projectDir, folder.path || '', folder.name);
        
        // Resolve subPath and prevent directory traversal
        const targetPath = path.resolve(rootSharedPath, subPath);

        if (!targetPath.startsWith(rootSharedPath)) {
            return res.status(403).json({ error: 'Access denied: Invalid path' });
        }

        if (!fs.existsSync(targetPath)) {
            return res.status(404).json({ error: 'Physical folder not found' });
        }

        const items = fs.readdirSync(targetPath, { withFileTypes: true });

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

            return {
                name: fixEncoding(item.name),
                isDirectory: item.isDirectory(),
                size: stats.size,
                createdAt: stats.birthtime,
                updatedAt: stats.mtime,
                url: item.isDirectory() ? null : `/uploads/projects/${relativePath}`
            };
        });

        res.status(200).json({
            status: 'success',
            data: {
                folderName: folder.name,
                currentPath: subPath,
                items: formattedItems,
                project: folder.project ? {
                    title: folder.project.title,
                    address: folder.project.address,
                    clientName: folder.project.client 
                        ? folder.project.client.name 
                        : 'Unbekannter Kunde'
                } : null
            }
        });
    } catch (error) {
        console.error('Error fetching shared folder:', error);
        res.status(400).json({ error: 'Server error fetching shared folder' });
    }
};

exports.downloadSharedFile = async (req, res) => {
    try {
        const { token } = req.params;
        const relativeFile = req.query.file; // This could now include subpaths like "docs/plan.pdf"

        const folder = await ProjectFolder.findOne({
            where: { share_token: token, is_public: true }
        });

        if (!folder) return res.status(404).json({ error: 'Not found' });

        const projectDir = path.join(UPLOADS_DIR, String(folder.project_id));
        const rootSharedPath = path.resolve(projectDir, folder.path || '', folder.name);
        
        const targetPath = path.resolve(rootSharedPath, relativeFile);

        if (!targetPath.startsWith(rootSharedPath)) {
            return res.status(403).json({ error: 'Access denied' });
        }

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
            return res.status(400).json({ error: 'Cannot download a directory' });
        }

        res.download(targetPath);
    } catch (error) {
        res.status(400).json({ error: 'Download failed' });
    }
};
