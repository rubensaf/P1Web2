const jwt = require('jsonwebtoken')
const jwt_secret = process.env.JWT_SECRET

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
const verifyToken = async (token) => {

    try {
        return jwt.verify(token, jwt_secret);
    } catch (error) {
        console.log(error)
        return null; // Si el token no es válido o expiró, retorna null
    }
};


module.exports = { tokenSign, verifyToken };