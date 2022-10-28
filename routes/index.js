var express = require('express');
var router = express.Router();

const User = require('../models/user');
const passport = require('passport');
const { generatePassword } = require('../utilities/passwordUtilities');


// GET - User Log In.
router.get('/login', (req, res, next) => {
  res.send("log in dude!");
})

router.get('/login-failure', (req, res, next) => {
  res.send("failed log in dude");
})

router.get('/success', (req, res, next) => {
  res.send("you are logged in now!");
})

// POST - User Log In.
router.post('/login', (req, res, next) => {
  console.log(req.body);
  next();
  },
  passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: '/success' 
  })
);

// POST - User Sign Up.
router.post('/register', (req, res, next) => {
  const saltHash = generatePassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    email: req.body.email,
    hash: hash,
    salt: salt
  })

  newUser.save();

  res.redirect('/login');
});


module.exports = router;
