const express = require('express');
const { body } = require('express-validator'); 
const { registerUser, loginUser } = require('../controllers/authController'); 

const router = express.Router();


router.post('/register', [
  body('username').notEmpty().withMessage('Username é obrigatório'),
  body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
], registerUser);


router.post('/login', [
  body('username').notEmpty().withMessage('Username é obrigatório'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
], loginUser);

module.exports = router;
