/* 
  All routes pertaining to authentication -> Login and SignUp
*/

var express = require("express");
var router = express.Router();

// Model, function, middleware imports.
const User = require('../models/user');
const utilities = require('../utilities/authenticationUtilities')

require('../config/database');


/**
 * -------------- LOG-IN / AUTHENTICATION ROUTES --------------------
*/

// GET - User Log In. NOT USED BY THE CLIENT.
router.get('/login', (req, res, next) => {
  const form = '<h1>Login Page</h1><form method="POST" action="/auth/login">\
  Enter Username:<br><input type="text" name="email">\
  <br>Enter Password:<br><input type="password" name="password">\
  <br><br><input type="submit" value="Submit"></form>';
  res.send(form);
});

// POST - User Log In.
router.post('/login', function(req, res, next) {
  User.findOne({ email: req.body.email })
    .then((user) => {

      // User not found in the database.
      if(user === null) {
        res.send({ success: false, errorMessage: 'Incorrect Credentials Provided'});
      }

      else {
        const isValid = utilities.validatePassword(req.body.password, user.hash, user.salt);

        // If valid user, fetch user data, and issue a JWT that can be attached to all request objects.
        if (isValid) {
          const tokenObejct = utilities.issueJWT(user);
          res.send({ success: true, user: user, token: tokenObejct, expiresIn: tokenObejct.expires });
        }

        // Wrong password provided.
        else {
          res.send({ success: false, errorMessage: 'Incorrect Credentials Provided'});
          }
      }
    })

    .catch((error) => {
      console.log(error);
      next(error);
    })
});

/**
 * -------------- REGISTRATION ROUTES -------------------------------
*/

// GET - User Registration. NOT USED BY THE CLIENT.
router.get('/register', (req, res, next) => {
    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="email">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';
    res.send(form);
});

// POST - User Registration.
router.post('/register', (req, res, next) => {
    console.log(req.body);
    const saltHash = utilities.generatePassword(req.body.password);
  
    const salt = saltHash.salt;
    const hash = saltHash.hash;
  
    const newUser = new User({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      salt: salt,
      hash: hash
    })
    
  
    newUser.save()
      .then((user) => {
        const jwt = utilities.issueJWT(user);
        res.json({ success: true, user: user, token: jwt.token, expiresIn: jwt.expires, msg: 'successful registration!' });
      })
      .catch((error) => {
        console.log(error);
        res.json({ msg : 'failed'})
      });
});

module.exports = router;