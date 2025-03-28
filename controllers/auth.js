const { matchedData } = require("express-validator");
const { tokenSign } = require("../utils/handleJwt.js");
const { encrypt } = require("../utils/handlePassword");
const { handleHttpError } = require("../utils/handleError.js");
const UsersModel = require("../models/nosql/users");

const registerCtrl = async (req, res) => {
    try {
        const data = matchedData(req); // Obtener los datos validados
        const password = await encrypt(data.password); // Encriptar la contraseña
        const body = { ...data, password }; // Agregar la contraseña encriptada

        console.log(body);

        const user = await UsersModel.create(body); // Crear usuario en la BD

        // Remover la contraseña del objeto antes de enviarlo
        user.set("password", undefined, { strict: false });

        const userData = {
            token: await tokenSign(user), // Generar token de autenticación
            user: user
        };

        res.send(userData);
    } catch (err) {
        console.log(err);
        handleHttpError(res, "ERROR_REGISTER_USER");
    }
};

module.exports = { registerCtrl };
