// All routes pertaining to authentication.
var express = require("express");
var router = express.Router();
const passport = require('passport');

// Model, function, middleware imports.
const User = require('../models/user');
const utilities = require('../utilities/authenticationUtilities')

require('../config/database');


/**
 * -------------- LOG-IN / AUTHENTICATION ROUTES --------------------
*/

// // GET - User Log In. Refactor for client later.
// router.get('/login', (req, res, next) => {
//     const form = '<h1>Login Page</h1><form method="POST" action="/auth/login">\
//     Enter Username:<br><input type="text" name="email">\
//     <br>Enter Password:<br><input type="password" name="password">\
//     <br><br><input type="submit" value="Submit"></form>';

//     res.send(form);
// });

// // POST - User Log In.
// router.post('/login', 
//   passport.authenticate('local', {
//     failureRedirect: '/auth/login-failure',
//     successRedirect: '/auth/login-success' 
//   })
// );

// // GET - User Log In Success! Redirect to PROFILE Page later on.
// router.get('/login-success', (req, res, next) => {
//     console.log(req);
//     res.json({ message : 'you are now logged in!' });
// });
  
// // GET - User Log In Failure. Refactor for client later.
// router.get('/login-failure', (req, res, next) => {
//     res.json({errorMessage: "Incorrect username or password."});
// });

// // GET - User Data on log in. Protected Route.
// router.get('/protected-route', isAuth, (req, res, next) => {
//     console.log(req.user);
//     const HTML = "<h1> You are in the protected route my man! </h1> <p><a href='/auth/logout'> Log Out </a></p>"
//     res.send(HTML);
// });

// // GET - Use Log Out.
// router.get('/logout', (req, res, next) => {
//     req.logOut(function(error) {
//       if (error) { 
//         return next(error);
//       }
//       res.redirect('/auth/login');
//     });
// });
  

/**
 * -------------- REGISTRATION ROUTES -------------------------------
*/

// GET - User Registration.
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
    })
    ;
  
     
});

module.exports = router;