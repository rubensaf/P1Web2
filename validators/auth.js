const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorRegister = [
    check("name").exists().notEmpty().isLength( {min:3, max: 99} ),
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength( {min:8, max: 64} ),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]



module.exports = { validatorRegister}