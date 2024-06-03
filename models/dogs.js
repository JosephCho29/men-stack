const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
    name: String,
    profile: String,
    isComingToPlay: Boolean,
})

const Dog = mongoose.model('Dog', dogSchema);

module.exports = Dog;