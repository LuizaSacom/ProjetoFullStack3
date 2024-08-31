const mongoose = require('mongoose');

const MonsterHunterDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const MonsterHunterData = mongoose.model('MonsterHunterData', MonsterHunterDataSchema);
module.exports = MonsterHunterData;
