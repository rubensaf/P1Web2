const express = require('express');
const router = express.Router();
const { registerCtrl, loginCtrl } = require("../controllers/auth"); 
const { validatorRegister, validatorLogin } = require("../validators/auth"); 

// Rutas con validadores
router.post('/register', validatorRegister, registerCtrl);
router.post('/login', validatorLogin, loginCtrl);

module.exports = router;
