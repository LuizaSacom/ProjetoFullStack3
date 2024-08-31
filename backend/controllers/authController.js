const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator'); 

const registerUser = async (req, res) => {
  const { username, password } = req.body;

 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
};


const loginUser = async (req, res) => {
  const { username, password } = req.body;

  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    
    const token = jwt.sign(
      { id: user._id, username: user.username }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, name: user.username }); 
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
};

module.exports = { registerUser, loginUser };
