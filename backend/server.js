const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const redis = require('redis');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const MonsterHunterData = require('./models/MonsterHunterData');
const authenticate = require('./middleware/authMiddleware');
const { check, validationResult } = require('express-validator');
const logger = require('./utils/logger');

const app = express();

// Configuração do cliente Redis
const redisClient = redis.createClient({
  url: process.env.REDIS_URL, 
});

redisClient.on('error', (err) => {
  logger.error('Redis error:', err);
});

// Tentando conectar ao Redis
redisClient.connect().catch((err) => {
  logger.error('Erro ao conectar ao Redis:', err);
});

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

// Configuração do pool de conexões mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,  
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

  
      await redisClient.del('monster_hunter_data');
      res.status(201).json(savedData);
    } catch (err) {
      logger.error('Erro ao inserir dados:', err);
      res.status(400).json({ error: err.message });
    }
  }
);

app.get('/api/monster_hunter_data', authenticate, async (req, res) => {
  try {
    const cachedData = await redisClient.get('monster_hunter_data');
    
    if (cachedData) {
      logger.info('Dados retornados do cache.');
      return res.json(JSON.parse(cachedData));
    }

    const data = await MonsterHunterData.find();
    await redisClient.setEx('monster_hunter_data', 3600, JSON.stringify(data)); // Cache por 1 hora
    logger.info('Dados recuperados do banco de dados e armazenados no cache.');
    res.json(data);
  } catch (err) {
    logger.error('Erro ao recuperar dados:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/monster_hunter_data/:id', authenticate, async (req, res) => {
  try {
    const cacheKey = `monster_hunter_data:${req.params.id}`;
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      logger.info(`Dados do ID ${req.params.id} retornados do cache.`);
      return res.json(JSON.parse(cachedData));
    }

    const data = await MonsterHunterData.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Item não encontrado' });

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(data)); // Cache por 1 hora
    logger.info(`Dados do ID ${req.params.id} recuperados do banco de dados e armazenados no cache.`);
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

    // Invalidate cache for data
    await redisClient.del('monster_hunter_data');
    await redisClient.del(`monster_hunter_data:${req.params.id}`);
    logger.info(`Dados atualizados para o ID ${req.params.id}.`);
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

    // Invalidate cache for data
    await redisClient.del('monster_hunter_data');
    await redisClient.del(`monster_hunter_data:${req.params.id}`);
    logger.info(`Dados deletados para o ID ${req.params.id}.`);
    res.json({ message: 'Item deletado com sucesso' });
  } catch (err) {
    logger.error('Erro ao deletar dados:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Servidor rodando na porta ${PORT}`));
