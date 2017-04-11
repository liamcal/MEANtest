var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var birdSchema = new Schema({
    name: String,
    species: String
});

var birdModel = mongoose.model('Bird', birdSchema);
module.exports = birdModel;
