const jwt = require('jsonwebtoken')
const jwt_secret = process.env.jwt_secret

const tokenSign = async (user) => {
    const sign = jwt.sign(
        {
        _id: user.id
        },
        jwt_secret,
        {
            expiresIn: "2h"
        }
    )
    return sign
}

module.exports = {tokenSign}