const { Role } = require('../../domain/models');

exports.getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']]
        });

        res.status(200).json({
            status: 'success',
            data: { roles }
        });
    } catch (err) {
        next(err);
    }
};
