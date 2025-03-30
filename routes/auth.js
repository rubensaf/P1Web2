const express = require('express');
const router = express.Router();
const { registerCtrl, loginCtrl , validateEmailCtrl } = require("../controllers/auth"); 
const { validatorRegister, validatorLogin , validateVerificationCode} = require("../validators/auth"); 
const {authenticate} = require("../middleware/authMiddleware");
const { getUserCtrl , deleteUser , forgotPassword } = require("../controllers/endpoint");


// Rutas con validadores
router.post('/register', validatorRegister, registerCtrl);
router.post('/login', validatorLogin, loginCtrl);
router.put('/validation', authenticate, validateVerificationCode, validateEmailCtrl); 

//Los EndPoints
router.get('/user', authenticate, getUserCtrl);
router.delete('/user', authenticate, deleteUser);
router.post('/forgot' , forgotPassword);


module.exports = router;
