/* 
    All routes pertaining to posts and comments.
*/

let express = require('express');
let router = express.Router();
let async  = require('async');

const User = require('../models/user');
const Post = require('../models/post');

const { body, validationResult } = require('express-validator');
const { SchemaTypes, default: mongoose } = require('mongoose');

// POST - Create new user post.
router.post( '/create_post', 

    body('postContent').isLength({ min: 1 }).withMessage('You cannot create an empty post.'),

    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors : errors.array() });
        }

        // 1: create and save post. 2: pass post to next step where user is found and push post._id to user.posts array.
        // TODO: maybe confirm that user exists, then create post, then push to user post array?
        async.waterfall([

            function(callback) {
                const newPost = new Post({
                    postContent : req.body.postContent,
                    postAuthor : mongoose.Types.ObjectId(req.body.userID)
                })
                newPost.save()
                callback(null, newPost);
            },

            function(newPost, callback) {
                User.updateOne({ _id : req.body.userID }, { 
                        $push : {  userPosts : mongoose.Types.ObjectId(newPost._id) }
                    }, {
                        upsert : true
                    }
                )
                .then((user) => {
                    console.log(user);
                })
                callback(null, 'done')
            }

        ], function(err, result) {
            if (err) {
                res.status(400).send({ msg : 'There was an async error...'});
            }
            res.status(200).json({ msg: 'Post created.' });
        });
    }
)

module.exports = router;