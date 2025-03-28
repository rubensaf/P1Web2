const express = require('express');
const router = express.Router();
const {registerCtrl} = require("../controllers/auth")
const {validatorRegister} = require("../validators/auth")


// Asegúrate de pasar las funciones como callbacks a las rutas
router.post('/register', validatorRegister, registerCtrl);

module.exports = router;

