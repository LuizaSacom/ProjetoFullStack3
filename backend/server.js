const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const MonsterHunterData = require('./models/MonsterHunterData');
const authenticate = require('./middleware/authMiddleware'); 
const { check, validationResult } = require('express-validator');
const logger = require('./utils/logger');

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Muitas requisições feitas de um IP. Tente novamente mais tarde.',
});

app.use(limiter);

app.use(compression());

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    logger.info('Conectado ao MongoDB');
})
.catch((err) => {
    logger.error('Erro ao conectar ao MongoDB:', err);
});

app.use('/api/auth', authRoutes);

app.post('/api/monster_hunter_data',
    [
      authenticate, 
      check('name', 'Nome é obrigatório').notEmpty(),
      check('category', 'Categoria é obrigatória').notEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const newData = new MonsterHunterData(req.body);
        const savedData = await newData.save();
        logger.info('Dados inseridos:', savedData);
        res.status(201).json(savedData);
      } catch (err) {
        logger.error('Erro ao inserir dados:', err);
        res.status(400).json({ error: err.message });
      }
    }
);

app.get('/api/monster_hunter_data', authenticate, async (req, res) => {
    try {
        const data = await MonsterHunterData.find();
        logger.info('Dados recuperados:', data);
        res.json(data);
    } catch (err) {
        logger.error('Erro ao recuperar dados:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/monster_hunter_data/:id', authenticate, async (req, res) => {
    try {
        const data = await MonsterHunterData.findById(req.params.id);
        if (!data) return res.status(404).json({ message: 'Item não encontrado' });
        logger.info('Dados recuperados para o ID', req.params.id);
        res.json(data);
    } catch (err) {
        logger.error('Erro ao recuperar dados pelo ID:', err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/monster_hunter_data/:id', authenticate, async (req, res) => {
    try {
        const updatedData = await MonsterHunterData.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedData) return res.status(404).json({ message: 'Item não encontrado' });
        logger.info('Dados atualizados para o ID', req.params.id);
        res.json(updatedData);
    } catch (err) {
        logger.error('Erro ao atualizar dados:', err);
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/monster_hunter_data/:id', authenticate, async (req, res) => {
    try {
        const deletedData = await MonsterHunterData.findByIdAndDelete(req.params.id);
        if (!deletedData) return res.status(404).json({ message: 'Item não encontrado' });
        logger.info('Dados deletados para o ID', req.params.id);
        res.json({ message: 'Item deletado com sucesso' });
    } catch (err) {
        logger.error('Erro ao deletar dados:', err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Servidor rodando na porta ${PORT}`));