const { body } = require("express-validator");

let validators = {
    name: body('name')
        .notEmpty().withMessage('name is required'),
    number: body('number')
        .notEmpty().withMessage('number is required')
        .isInt({ min: 0 }).withMessage('number start at 0'),
    position: body('position')
        .notEmpty().withMessage('position is required'),
    teamId: body('teamId')
        .notEmpty().withMessage('team id is required')
}

module.exports = {
    create: [validators.name, validators.number, validators.position, validators.teamId],
    update: [validators.name, validators.number, validators.position, validators.teamId],
}