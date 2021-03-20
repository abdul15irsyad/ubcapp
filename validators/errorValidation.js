const { validationResult } = require('express-validator')

module.exports = (req, res) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: false,
            message: 'inputs not valid',
            errors: errors.array({ onlyFirstError: true })
        })
    }
}