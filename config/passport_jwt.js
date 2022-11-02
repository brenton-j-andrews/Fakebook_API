const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const path = require('path');
const fs = require('fs');
const User = require('../models/user');

const pathToKey = path.join(__dirname, '..', 'PUBLIC_KEY.pem');
const PUBLIC_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUBLIC_KEY,
    algorithms: ['RS256']
}

const strategy = new JwtStrategy(options, (payload, done) => {
    User.findOne({ _id: payload.sub })
      .then((user) => {
          if (user) {
              return done(null, user);
          } 
          else {
              return done(null, false);
          }
      })
      .catch(error => done(error, null));
})
  
// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
    passport.use(strategy);
}
