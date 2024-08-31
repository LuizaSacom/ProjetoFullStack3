const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const MonsterHunterData = require('./models/MonsterHunterData');
const authenticate = require('./middleware/authMiddleware'); 

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

app.use('/api/auth', authRoutes);

app.post('/api/monster_hunter_data', authenticate, async (req, res) => {
    try {
        const newData = new MonsterHunterData(req.body);
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.get('/api/monster_hunter_data', authenticate, async (req, res) => {
    try {
        const data = await MonsterHunterData.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/monster_hunter_data/:id', authenticate, async (req, res) => {
    try {
        const data = await MonsterHunterData.findById(req.params.id);
        if (!data) return res.status(404).json({ message: 'Item não encontrado' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/monster_hunter_data/:id', authenticate, async (req, res) => {
    try {
        const updatedData = await MonsterHunterData.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedData) return res.status(404).json({ message: 'Item não encontrado' });
        res.json(updatedData);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/monster_hunter_data/:id', authenticate, async (req, res) => {
    try {
        const deletedData = await MonsterHunterData.findByIdAndDelete(req.params.id);
        if (!deletedData) return res.status(404).json({ message: 'Item não encontrado' });
        res.json({ message: 'Item deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
