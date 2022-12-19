var express = require('express');
var router = express.Router();

// Import router files.
let authRouter = require('./authRouter');
let userRouter = require('./userRouter');
let postRouter = require('./postRouter');

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/post", postRouter);

module.exports = router;
