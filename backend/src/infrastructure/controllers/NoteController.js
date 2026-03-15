const { Note, User, Project } = require('../../domain/models');
const AppError = require('../../utils/appError');

// Get all notes, potentially filtered by date or month
exports.getNotes = async (req, res, next) => {
    try {
        const notes = await Note.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name']
                },
                {
                    model: Project,
                    as: 'project',
                    attributes: ['id', 'project_number', 'title']
                }
            ],
            order: [['date', 'ASC'], ['createdAt', 'DESC']]
        });

        res.status(200).json({
            status: 'success',
            results: notes.length,
            data: { notes }
        });
    } catch (err) {
        next(err);
    }
};


// Create a new note
exports.createNote = async (req, res, next) => {
    try {
        const { title, content, date, color, project_id } = req.body;

        // TODO: Replace with actual auth middleware req.user.id
        const user_id = req.user ? req.user.id : (await User.findOne()).id;

        if (!title || !content || !date) {
            return next(new AppError('Bitte füllen Sie Titel, Inhalt und Datum aus', 400));
        }

        const newNote = await Note.create({
            title,
            content,
            date,
            color,
            project_id: project_id || null,
            user_id
        });

        // Fetch back with user info and project info
        const noteWithUser = await Note.findByPk(newNote.id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'name'] },
                { model: Project, as: 'project', attributes: ['id', 'project_number', 'title'] }
            ]
        });

        res.status(201).json({
            status: 'success',
            data: { note: noteWithUser }
        });
    } catch (err) {
        next(err);
    }
};

// Delete note
exports.deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findByPk(req.params.id);

        if (!note) {
            return next(new AppError('Notiz nicht gefunden', 404));
        }

        // Only logic or admin can delete. For now allow logic.
        await note.destroy();

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

// Update note
exports.updateNote = async (req, res, next) => {
    try {
        const note = await Note.findByPk(req.params.id);

        if (!note) {
            return next(new AppError('Notiz nicht gefunden', 404));
        }

        const { isDone, title, content, color, date, project_id } = req.body;

        if (isDone !== undefined) note.isDone = isDone;
        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;
        if (color !== undefined) note.color = color;
        if (date !== undefined) note.date = date;
        if (project_id !== undefined) note.project_id = project_id || null;

        await note.save();

        const updatedNote = await Note.findByPk(note.id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'name'] },
                { model: Project, as: 'project', attributes: ['id', 'project_number', 'title'] }
            ]
        });

        res.status(200).json({
            status: 'success',
            data: { note: updatedNote }
        });
    } catch (err) {
        next(err);
    }
};
