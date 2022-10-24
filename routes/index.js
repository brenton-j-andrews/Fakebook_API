var express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express.' });
});

router.get('/signup', function(req, res, next) {
  res.send("hello!");
})

// POST request on sign-up page.
router.post('/signup',
  passport.authenticate('signup', { session: false }),
  async ( req, res, next ) => {
    res.json({
      message: "Signup Successful!",
      user: req.user
    })
  }
)

// POST request on user login page.
router.post('/login',

  async (req, res, next) => {
    passport.authenticate(
      'login',

      async (err, user, info) => {
        console.log("error: " + err);
        console.log("user: " + user);
        console.log('info: ' + JSON.stringify(info));

        try {
          if (err || !user) {
            const error = new Error('An error occurred: ' + info.message);

            return next(error);
          }

          req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error);

              const body = { _id: user._id, email: user.email };
              const token = jwt.sign({ user: body }, 'TOP_SECRET');

              return res.json({ token });
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);



module.exports = router;
