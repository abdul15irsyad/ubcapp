const { body } = require("express-validator");

let validators = {
    name: body('name')
        .notEmpty().withMessage('name is required'),
}

module.exports = {
    create: [validators.name],
    update: [validators.name],
}