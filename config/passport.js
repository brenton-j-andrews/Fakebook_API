const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const validatePassword = require('../utilities/passwordUtilities').validatePassword;

const fields = {
    usernameField: 'email',
    passwordField: 'password'
};

const verifyCallback = (username, password, done) => {
    console.log("hello?");
    User.findOne({ username : username})
        .then((user) => {
            // No errors, user not found.
            if (!user) {
                return done(null, false);
            }

            const passwordIsValid = validatePassword(password, user.hash, user.salt);

            if (passwordIsValid) {
                // Return status 200. No errors, user found and authenticated.
                return done(null, user);
            }

            else {
                // Return status 200. No errors but user not found.
                return done(null, false);
            }
        })

        .catch((err) => {
            done(err);
        })
} 

const strategy = new LocalStrategy(fields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});
