let mongoose = require('mongoose');

let accountSchema = mongoose.Schema({
    username: String,
    password: String,
    birthDay: Number,
    birthMonth: Number,
    birthYear: Number,
    online: Boolean,
    image: String,
    mantra: String,
    rank: Number
});

let Account = module.exports = mongoose.model('Account', accountSchema);