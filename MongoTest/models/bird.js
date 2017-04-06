/* Import mongoose Schema */
var Schema = require('mongoose').Schema;

/* Specift our Bird schema */
var birdSchema = new Schema({
    name: String,
    bird: String
});

/* Create the model using the schema */
var birdModel = mongoose.model('Bird', birdSchema);

/* Export the schema */
module.exports = birdModel;
