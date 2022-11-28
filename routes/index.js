var express = require('express');
var router = express.Router();


// Import router files.
let authRouter = require('./authRouter');
let userRouter = require('./userRouter');
router.use("/auth", authRouter);
router.use("/user", userRouter);

// // GET - Home Page. Redirect to Login Page eventually.
// router.get('/', (req, res, next) => {
//   res.send('<h1>Home</h1><p>Please <a href="/auth/register">register</a></p><br><a href="/auth/login"> Log In </a> <a href="/auth/register"> Register </a>');
// });

module.exports = router;
