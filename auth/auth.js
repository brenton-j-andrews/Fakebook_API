const passport = require('passport');
const localStrategy = require('passport-local');

const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const UserModel = require('../models/user');

// Sign-up action...
passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },

        async (email, password, done) => {
            try {
                const user = await UserModel.create({ 
                    email, 
                    password 
                });

                return done(null, user);
            } 

            catch (error) {
                done(error);
            }
        }
    )
)

// Login action.
passport.use(
    'login',

    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
    
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });

                if (!user) {
                    console.log("am i in this fucking part?");
                    return done(null, false, { message: "User not found" });
                }

                console.log("before validate...");
                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: "Incorrect Password" });
                }

                return done(null, user, { message: "You are now logged in."});
            }

            catch (error) {
                return done(error);
            }
        }
    )
)

// Verify JWT.
passport.use(
    new JWTStrategy({
        secretOrKey: 'TOP_SECRET',
        jwtFromRequest: ExtractJwt.fromUrlQueryParameter('secret_token')
    },

    async (token, done) => {
        try {
            return done(null, token.user );
        }

        catch (error) {
            done(error);
        }
    }
    )
)