var express = require('express');
var router = express.Router();


// Import router files.
let authRouter = require('./authRouter');
let userRouter = require('./userRouter');
router.use("/auth", authRouter);
router.use("/user", userRouter);

module.exports = router;
