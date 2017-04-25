const AuthenticationController = require('./controllers/authentication');
const BirdController = require('./controllers/bird');
const express = require('express');
const passportService = require('./config/passport');
const passport = require('passport');
const path = require('path');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

const REQUIRE_ADMIN = "Admin";
const REQUIRE_EXPERT = "Expert";
const REQUIRE_MEMBER = "Member";


module.exports = function(app) {
  // Initializing route groups
  const apiRoutes = express.Router();
  const authRoutes = express.Router();
  const birdRoutes = express.Router();

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  apiRoutes.use('/bird', birdRoutes);

  birdRoutes.get('/retrieve', BirdController.getBirds);
  birdRoutes.post('/add', BirdController.addBird);
  birdRoutes.delete('/delete/:bird_id', BirdController.removeBird);
  // Registration route
  authRoutes.post('/register', AuthenticationController.register);

  // Login route
  authRoutes.post('/login', AuthenticationController.login);

// Set url for API group routes
  app.use('/api', apiRoutes);
};
