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

// GET - Other users to add on clicking the search bar. Will add search parameter in a bit...
router.get('/profile/search', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    User.find()
    .then((result) => {
        console.log(result.data);
        res.send(result);
    })
})

module.exports = router;