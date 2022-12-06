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
    User.findById({ _id : req.headers.userid }, { salt : 0, hash : 0})
    .then((result) => {
        res.send(result)
    })
})

// GET - Other users to add on clicking the search bar. Will add search parameter in a bit...
router.get('/profile/search', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    User.find()
    .then((result) => {
        res.send(result);
    })
})

// POST - Send Friend Request to another user. 
// Cannot get the auth headers sent from the client without it breaking, removing authentication for now...
router.post('/friend_request', (req, res, next) => { 
    console.log('am i here?');
    User.findByIdAndUpdate(req.body.user_id, {
        $push : { friends : req.body.recipient_id },
        function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                console.log('how about here?');
            }
        }
    })
    res.send('hmmm');
});

module.exports = router;