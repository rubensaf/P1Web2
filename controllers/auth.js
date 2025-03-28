const { matchedData, body } = require("express-validator");
const { tokenSign } = require("../utils/handleJwt.js");
const { encrypt , compare } = require("../utils/handlePassword");
const { handleHttpError } = require("../utils/handleError.js");
const UsersModel = require("../models/nosql/users");


const registerCtrl = async (req, res) => {
    try {
        const data = matchedData(req); // Obtener los datos validados

        // Encriptar la contraseña
        const password = await encrypt(data.password);
        const body = { 
            ...data, 
            password, 
            status: data.status || "inactive"  // Si no se pasa status, se asigna 'inactive'
        };

        console.log(body);

        // Crear usuario en la base de datos
        const user = await UsersModel.create(body); 

        // Remover la contraseña del objeto antes de enviarlo
        user.set("password", undefined, { strict: false });

        // Generar el token
        const userData = {
            token: await tokenSign(user), // Generar token de autenticación
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                _id: user._id,
                status: user.status, // Aseguramos que 'status' también se incluya en la respuesta
            }
        };

        res.send(userData); // Enviar respuesta con token y datos del usuario
    } catch (err) {
        console.log(err);
        handleHttpError(res, "ERROR_REGISTER_USER");
    }
};


const loginCtrl = async (req, res) => {
    try {
        // Validación de datos de entrada
        const data = matchedData(req);       
        // Buscar usuario en la base de datos
        let user;
        if (process.env.ENGINE_DB === "nosql") {
            console.log("A")
            // Si estamos usando MongoDB (NoSQL), usamos findOne con el modelo de Mongoose
            user = await UsersModel.findOne({ email: data.email }).select("password name role email status");
        } else {
            // Si estamos usando una base de datos SQL, usamos un método de SQL ORM como Sequelize o similar
            user = await UsersModel.findOne({ where: { email: data.email } });
        }
        console.log(user)
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Comprobar si la contraseña es válida
        const isPasswordValid = await compare(data.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Asegurarse de que la propiedad 'status' esté definida antes de usarla
        if (typeof user.status === 'undefined' || user.status === null) {
            user.status = 'inactive';  // Establece un valor por defecto si es necesario
        }

        // Remover la contraseña antes de enviar los datos al cliente
        user.set('password', undefined, { strict: false });

        // Generar token de autenticación
        const token = await tokenSign(user);

        // Enviar respuesta con el token y datos del usuario
        res.status(200).json({
            token,
            user: {
                email: user.email,
                status: user.status,
                role: user.role,
                _id: user._id
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


module.exports = { registerCtrl , loginCtrl };
