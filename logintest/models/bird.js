/* Import mongoose Schema */
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

/* Specift our Bird schema */
var birdSchema = new Schema({
    name: String,
    bird: String,
    username: String
});

/* Create the model using the schema */
var birdModel = mongoose.model('Bird', birdSchema);

/* Export the schema */
module.exports = birdModel;
