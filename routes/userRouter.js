// All routes pertaining to authentication.
var express = require("express");
var router = express.Router();
const passport = require('passport');

// Model, function, middleware imports.
const User = require('../models/user');
const utilities = require('../utilities/authenticationUtilities')

require('../config/database');

// GET - Signed in user data for profile page.
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.send("hello!")
})

module.exports = router;