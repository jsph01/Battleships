let mongoose = require('mongoose');

let matchSchema = mongoose.Schema({
    player1: String,
    player2: String,
    player1Grid: Array,
    player2Grid: Array
});

let Match = module.exports = mongoose.model('Match', matchSchema);