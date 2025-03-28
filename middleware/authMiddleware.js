const {verifyToken} = require("../utils/handleJwt")
const UserModel = require("../models/nosql/users")

const authenticate = async (req, res, next) => {
    try{
        if(!req.headers.authorization){
            res.status(403).send("NOT_TOKEN")
        }
        const token = req.headers.authorization.split(' ').pop()
        const dataToken = await verifyToken(token)
        if(!dataToken._id){
            res.status(403).send("ERROR_ID_TOKEN") 
            return
        } 
        const user = await UserModel.findById(dataToken._id)
        req.user = user

        next()
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
}
module.exports = {authenticate};
