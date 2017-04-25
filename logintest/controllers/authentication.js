const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/users');
const config = require('../config/main');
const passportService = require('../config/passport');
const passport = require('passport');


function generateToken(user) {
    return jwt.sign(user, config.secret, {
        expiresIn: 10080 // in seconds
    });
}

// Set user info from request
function setUserInfo(request) {
    return {
        _id: request._id,
        username: request.username,
        role: request.role
    };
}

// Login Route
exports.login = function(req, res, next) {

    passport.authenticate('local', function(err, user, info) {
        if (err) {
            console.log(err);
            res.status(404).json("Invalid Login");;
        }

        else if (!user) {
            // console.log("no user")
            // console.log(info);
            res.status(401).json(info);
        }
        else {
            var userInfo = setUserInfo(user);
            res.status(200).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            });
        }
    })(req,res);

}



// Registration Route
exports.register = function(req, res, next) {
  // Check for registration errors
  const username = req.body.username;
  const password = req.body.password;

  // Return error if no email provided
  if (!username) {
    return res.status(422).send({ error: 'You must enter a username.'});
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  User.findOne({ username: username }, function(err, existingUser) {
      if (err) { return next(err); }

      // If user is not unique, return error
      if (existingUser) {
        return res.status(422).send({ error: 'That username is already in use.' });
      }

      // If email is unique and password was provided, create account
      let user = new User({
        username: username,
        password: password
      });

      user.save(function(err, user) {
        if (err) { return next(err); }

        // Respond with JWT if user was created

        var userInfo = setUserInfo(user);

        res.status(201).json({
          token: 'JWT ' + generateToken(userInfo),
          user: userInfo
        });
      });
  });
}

// Authorization Middleware
// Role authorization check
exports.roleAuthorization = function(role) {
  return function(req, res, next) {
    const user = req.user;

    User.findById(user._id, function(err, foundUser) {
      if (err) {
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      }

      // If user is found, check role.
      if (foundUser.role == role) {
        return next();
      }

      res.status(401).json({ error: 'You are not authorized to view this content.' });
      return next();
  });
  };
};
