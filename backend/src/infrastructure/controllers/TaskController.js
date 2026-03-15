const { Task, User, TaskImage, Project } = require('../../domain/models');
const AppError = require('../../utils/appError');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Get all tasks
exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.findAll({
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'name'] },
                { model: User, as: 'creator', attributes: ['id', 'name'] },
                { model: TaskImage, as: 'images' },
                { model: Project, as: 'project', attributes: ['id', 'project_number', 'title'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            status: 'success',
            results: tasks.length,
            data: { tasks }
        });
    } catch (err) {
        next(err);
    }
};

// Create a new task
exports.createTask = async (req, res, next) => {
    try {
        const { title, description, assigned_to_id, status, project_id, due_date } = req.body;

        let created_by_id = req.user?.id;
        if (!created_by_id) {
            const firstUser = await User.findOne();
            created_by_id = firstUser?.id;
        }

        if (!title) {
            return next(new AppError('Bitte geben Sie einen Titel an', 400));
        }

        const newTask = await Task.create({
            title,
            description,
            status: status || 'In Arbeit',
            assigned_to_id: assigned_to_id || null,
            project_id: project_id || null,
            due_date: due_date || null,
            created_by_id
        });

        // Handle uploaded images: uploads/tasks/[taskId]/
        if (req.files && req.files.length > 0) {
            const taskDir = path.join(__dirname, '../../../../uploads/tasks', String(newTask.id));

            if (!fs.existsSync(taskDir)) {
                fs.mkdirSync(taskDir, { recursive: true });
            }

            for (const file of req.files) {
                const uniqueFileName = `${Date.now()}_${file.originalname}`;
                const newPath = path.join(taskDir, uniqueFileName);
                fs.renameSync(file.path, newPath);

                await TaskImage.create({
                    task_id: newTask.id,
                    path: `/uploads/tasks/${newTask.id}/${uniqueFileName}`
                });
            }
        }

        const taskWithData = await Task.findByPk(newTask.id, {
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'name'] },
                { model: User, as: 'creator', attributes: ['id', 'name'] },
                { model: TaskImage, as: 'images' },
                { model: Project, as: 'project', attributes: ['id', 'project_number', 'title'] }
            ]
        });

        res.status(201).json({
            status: 'success',
            data: { task: taskWithData }
        });
    } catch (err) {
        console.error('Error in createTask:', err);
        next(err);
    }
};

// Update task
exports.updateTask = async (req, res, next) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return next(new AppError('Aufgabe nicht gefunden', 404));

        const { status, title, description, assigned_to_id, project_id, due_date } = req.body;

        if (status !== undefined) task.status = status;
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (assigned_to_id !== undefined) task.assigned_to_id = assigned_to_id || null;
        if (project_id !== undefined) task.project_id = project_id || null;
        if (due_date !== undefined) task.due_date = due_date || null;

        await task.save();

        if (req.files && req.files.length > 0) {
            const taskDir = path.join(__dirname, '../../../../uploads/tasks', String(task.id));

            if (!fs.existsSync(taskDir)) {
                fs.mkdirSync(taskDir, { recursive: true });
            }

            for (const file of req.files) {
                const uniqueFileName = `${Date.now()}_${file.originalname}`;
                const newPath = path.join(taskDir, uniqueFileName);
                fs.renameSync(file.path, newPath);

                await TaskImage.create({
                    task_id: task.id,
                    path: `/uploads/tasks/${task.id}/${uniqueFileName}`
                });
            }
        }

        const updatedTask = await Task.findByPk(task.id, {
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'name'] },
                { model: User, as: 'creator', attributes: ['id', 'name'] },
                { model: TaskImage, as: 'images' },
                { model: Project, as: 'project', attributes: ['id', 'project_number', 'title'] }
            ]
        });

        res.status(200).json({
            status: 'success',
            data: { task: updatedTask }
        });
    } catch (err) {
        console.error('Error in updateTask:', err);
        next(err);
    }
};

// Delete task
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return next(new AppError('Aufgabe nicht gefunden', 404));

        const taskId = String(task.id);
        await task.destroy();

        // Clean up images from DB and FS
        await TaskImage.destroy({ where: { task_id: taskId } });

        const taskDir = path.join(__dirname, '../../../../uploads/tasks', taskId);
        if (fs.existsSync(taskDir)) {
            fs.rmSync(taskDir, { recursive: true, force: true });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        console.error('Error in deleteTask:', err);
        next(err);
    }
};
