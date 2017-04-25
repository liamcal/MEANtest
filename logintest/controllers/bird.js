const Bird = require('../models/bird');

/* Get requests, data needed from DB */
exports.getBirds = function (req, res, next) {
    /* Users may specify a get parameter to filter results */
    var filter = new RegExp(req.query.filter, "i")
    Bird.find().or([ {name : filter}, {bird : filter}, {username: filter} ]).exec(function(err, results) {
        if (err)
            return next(err);
        /* Send back the results */
        res.status(200).json(results);
    });
};

/* Post request, used to add new birds to DB */
exports.addBird = function(req, res, next) {
    var birdDetails = req.body;
    /* Create a new Bird object and add to DB */
    Bird.create(birdDetails, function(err, results) {
        if (err)
            return next(err);
        /* Retrieve the updated list of birds and send as response */
        Bird.find(function(err, results) {
            if (err)
                return next(err);
            res.status(201).json(results);
        });
    });
};


/* Delete request, used to remove existing birds from DB */
exports.removeBird = function(req, res, next) {
    var idToDelete = req.params.bird_id;
    /* Remove the bird with matching ID */
    Bird.remove().where({ _id : idToDelete}).exec(function(err, todo) {
        if (err)
            return next(err);
        /* Retrieve the updated list of birds and send as response */
        Bird.find(function(err, birds) {
            if (err)
                return next(err);
            res.status(200).json(birds);
        });
    });
};
