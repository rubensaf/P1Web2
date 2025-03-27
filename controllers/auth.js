const { matchedData } = require("express-validator");
const { tokenSign } = require("../utils/handleJwt");
const { encrypt, compare } = require("../utils/handlePassword");
const { handleHttpError } = require("../utils/handleError");
const { usersModel } = require("../models/nosql/users");
const crypto = require("crypto");

/**
 * Encargado de registrar un nuevo usuario
 * @param {*} req 
 * @param {*} res 
 */
const registerCtrl = async (req, res) => {
    try {
        req = matchedData(req);

        // Verificar si el email ya existe
        const existingUser = await usersModel.findOne({ email: req.email });
        if (existingUser) {
            return handleHttpError(res, "EMAIL_ALREADY_REGISTERED", 409);
        }

        // Hashear la contraseña
        const password = await encrypt(req.password);

        // Generar código de verificación aleatorio de 6 dígitos
        const verificationCode = crypto.randomInt(100000, 999999);

        // Crear usuario con estado "pending"
        const body = { ...req, password, verificationCode, status: "pending", attempts: 3 };
        const dataUser = await usersModel.create(body);
        dataUser.set("password", undefined, { strict: false });

        const data = {
            token: await tokenSign(dataUser),
            user: {
                email: dataUser.email,
                status: dataUser.status,
                role: dataUser.role
            }
        };
        res.send(data);
    } catch (err) {
        console.log(err);
        handleHttpError(res, "ERROR_REGISTER_USER");
    }
};

/**
 * Validación del email con código
 * @param {*} req 
 * @param {*} res 
 */
const validateEmailCtrl = async (req, res) => {
    try {
        req = matchedData(req);
        const { code } = req;
        const user = await usersModel.findOne({ email: req.email });

        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        if (user.status === "validated") {
            return handleHttpError(res, "EMAIL_ALREADY_VALIDATED", 400);
        }

        if (user.attempts <= 0) {
            return handleHttpError(res, "MAX_ATTEMPTS_REACHED", 403);
        }

        if (user.verificationCode !== parseInt(code)) {
            user.attempts -= 1;
            await user.save();
            return handleHttpError(res, "INVALID_VERIFICATION_CODE", 401);
        }

        // Si el código es correcto, validamos el email
        user.status = "validated";
        user.verificationCode = null;
        user.attempts = null;
        await user.save();

        res.send({ message: "Email validated successfully" });
    } catch (err) {
        console.log(err);
        handleHttpError(res, "ERROR_VALIDATING_EMAIL");
    }
};

/**
 * Encargado de hacer login del usuario
 * @param {*} req 
 * @param {*} res 
 */
const loginCtrl = async (req, res) => {
    try {
        req = matchedData(req);
        const user = await usersModel.findOne({ email: req.email }).select("password name role email status");

        if (!user) {
            return handleHttpError(res, "USER_NOT_EXISTS", 404);
        }

        if (user.status !== "validated") {
            return handleHttpError(res, "EMAIL_NOT_VERIFIED", 403);
        }

        const hashPassword = user.password;
        const check = await compare(req.password, hashPassword);

        if (!check) {
            return handleHttpError(res, "INVALID_PASSWORD", 401);
        }

        user.set("password", undefined, { strict: false });

        const data = {
            token: await tokenSign(user),
            user
        };

        res.send(data);
    } catch (err) {
        console.log(err);
        handleHttpError(res, "ERROR_LOGIN_USER");
    }
};

module.exports = { registerCtrl, validateEmailCtrl, loginCtrl };
