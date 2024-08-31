const express = require('express');
const router = express.Router();
const MonsterHunterData = require('../models/MonsterHunterData');


router.post('/', async (req, res) => {
    try {
        const newData = new MonsterHunterData(req.body);
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const data = await MonsterHunterData.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const data = await MonsterHunterData.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'Dado não encontrado' });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updatedData = await MonsterHunterData.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } 
        );
        if (!updatedData) {
            return res.status(404).json({ message: 'Dado não encontrado' });
        }
        res.json(updatedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const deletedData = await MonsterHunterData.findByIdAndDelete(req.params.id);
        if (!deletedData) {
            return res.status(404).json({ message: 'Dado não encontrado' });
        }
        res.json({ message: 'Dado removido com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
