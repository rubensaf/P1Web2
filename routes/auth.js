const express = require('express');
const router = express.Router();
const { registerCtrl, loginCtrl , validateEmailCtrl } = require("../controllers/auth"); 
const { validatorRegister, validatorLogin , validateVerificationCode} = require("../validators/auth"); 
const {authenticate} = require("../middleware/authMiddleware");

// Rutas con validadores
router.post('/register', validatorRegister, registerCtrl);
router.post('/login', validatorLogin, loginCtrl);
router.put('/validation', authenticate, validateVerificationCode, validateEmailCtrl)



module.exports = router;
