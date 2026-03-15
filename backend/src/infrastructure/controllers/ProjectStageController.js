const { ProjectStage, User, ProjectStageImage } = require('../../domain/models');
const AppError = require('../../utils/appError');
const fs = require('fs');
const path = require('path');

// Get all stages for a project
exports.getStages = async (req, res, next) => {
    try {
        const { projectId } = req.query;
        const where = projectId ? { project_id: projectId } : {};

        const stages = await ProjectStage.findAll({
            where,
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'name'] },
                { model: User, as: 'creator', attributes: ['id', 'name'] },
                { model: ProjectStageImage, as: 'images' }
            ],
            order: [['createdAt', 'ASC']]
        });

        res.status(200).json({
            status: 'success',
            results: stages.length,
            data: { stages }
        });
    } catch (err) {
        next(err);
    }
};

// Create a new stage
exports.createStage = async (req, res, next) => {
    try {
        const { title, description, assigned_to_id, status, project_id } = req.body;

        let created_by_id = req.user?.id;
        if (!created_by_id) {
            const admin = await User.findOne({ where: { email: 'admin@ep-bau.de' } });
            created_by_id = admin?.id;
        }

        if (!title || !project_id) {
            return next(new AppError('Titel und Projekt-ID sind erforderlich', 400));
        }

        const newStage = await ProjectStage.create({
            title,
            description,
            status: status || 'In Arbeit',
            assigned_to_id: assigned_to_id || null,
            created_by_id,
            project_id
        });

        // Handle uploaded images
        if (req.files && req.files.length > 0) {
            // Path: admin/uploads/projects/[projectId]/stages/[stageId]/
            const stageDir = path.join(__dirname, '../../../../uploads/projects', String(project_id), 'stages', String(newStage.id));

            if (!fs.existsSync(stageDir)) {
                fs.mkdirSync(stageDir, { recursive: true });
            }

            for (const file of req.files) {
                const timestamp = Date.now();
                const ext = path.extname(file.originalname);
                const uniqueFileName = `${timestamp}_${file.originalname}`;
                const newPath = path.join(stageDir, uniqueFileName);

                fs.renameSync(file.path, newPath);

                await ProjectStageImage.create({
                    project_stage_id: newStage.id,
                    path: `/uploads/projects/${project_id}/stages/${newStage.id}/${uniqueFileName}`
                });
            }
        }

        const stageWithData = await ProjectStage.findByPk(newStage.id, {
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'name'] },
                { model: User, as: 'creator', attributes: ['id', 'name'] },
                { model: ProjectStageImage, as: 'images' }
            ]
        });

        res.status(201).json({
            status: 'success',
            data: { stage: stageWithData }
        });
    } catch (err) {
        console.error('Error in createStage:', err);
        next(err);
    }
};

// Update stage
exports.updateStage = async (req, res, next) => {
    try {
        const stage = await ProjectStage.findByPk(req.params.id);
        if (!stage) return next(new AppError('Etappe nicht gefunden', 404));

        const { status, title, description, assigned_to_id, imagesToDelete } = req.body;

        if (status !== undefined) stage.status = status;
        if (title !== undefined) stage.title = title;
        if (description !== undefined) stage.description = description;
        if (assigned_to_id !== undefined) stage.assigned_to_id = assigned_to_id || null;

        await stage.save();

        // Handle image deletions
        if (imagesToDelete) {
            const idsToDelete = typeof imagesToDelete === 'string' ? JSON.parse(imagesToDelete) : imagesToDelete;
            if (Array.isArray(idsToDelete) && idsToDelete.length > 0) {
                const images = await ProjectStageImage.findAll({
                    where: { id: idsToDelete, project_stage_id: stage.id }
                });

                for (const img of images) {
                    const fullPath = path.join(__dirname, '../../../../', img.path);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                    }
                    await img.destroy();
                }
            }
        }

        // Handle new image uploads
        if (req.files && req.files.length > 0) {
            const stageDir = path.join(__dirname, '../../../../uploads/projects', String(stage.project_id), 'stages', String(stage.id));

            if (!fs.existsSync(stageDir)) {
                fs.mkdirSync(stageDir, { recursive: true });
            }

            for (const file of req.files) {
                const timestamp = Date.now();
                const uniqueFileName = `${timestamp}_${file.originalname}`;
                const newPath = path.join(stageDir, uniqueFileName);

                fs.renameSync(file.path, newPath);

                await ProjectStageImage.create({
                    project_stage_id: stage.id,
                    path: `/uploads/projects/${stage.project_id}/stages/${stage.id}/${uniqueFileName}`
                });
            }
        }

        const updatedStage = await ProjectStage.findByPk(stage.id, {
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'name'] },
                { model: User, as: 'creator', attributes: ['id', 'name'] },
                { model: ProjectStageImage, as: 'images' }
            ]
        });

        res.status(200).json({
            status: 'success',
            data: { stage: updatedStage }
        });
    } catch (err) {
        console.error('Error in updateStage:', err);
        next(err);
    }
};

// Delete stage
exports.deleteStage = async (req, res, next) => {
    try {
        const stage = await ProjectStage.findByPk(req.params.id);
        if (!stage) return next(new AppError('Etappe nicht gefunden', 404));

        const stageId = String(stage.id);
        const projectId = String(stage.project_id);

        await stage.destroy();

        // Clean up from FS
        const stageDir = path.join(__dirname, '../../../../uploads/projects', projectId, 'stages', stageId);
        if (fs.existsSync(stageDir)) {
            fs.rmSync(stageDir, { recursive: true, force: true });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        console.error('Error in deleteStage:', err);
        next(err);
    }
};
