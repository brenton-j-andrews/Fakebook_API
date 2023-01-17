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
router.post('/create_post', 

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

// DELETE - Delete selected post and associated comments.
router.delete('/delete_post', 
    (req, res, next) => {
        Post.deleteOne({ _id : req.headers.postid })
        .then(result => {
            res.status(200).json({ msg: 'Post has been deleted' });
        })
        .catch(error => {
            res.status(400).json({ msg: `Error: ${error}`})
        })
    }
)

// POST - Like a post.
router.post('/like_post', 

    (req, res, next) => {

        Post.updateOne(
            { _id : req.body.postid }, 
            {$addToSet : { postLikes : mongoose.Types.ObjectId(req.body.userid) }
        })
        .then(result => {
            if (result.matchedCount === 1 && result.modifiedCount === 0) {
                res.status(200).json({ msg : 'You have already liked this post.'});
            } 
            else {
                res.status(200).json({ msg : 'Post has been liked'});
            }

        })
        .catch(error => {
            res.status(400).json({ msg: `Error: ${error}`});
        })
})

// POST - Unlike a post.
router.post('/unlike_post',
    (req, res, next) => {
        Post.updateOne(
            { _id : req.body.postid }, 
            { $pull : { postLikes : mongoose.Types.ObjectId(req.body.userid) }
        })
        .then(result => {
            res.status(200).json({ msg : 'Post like has been removed.'});
        })
        .catch(error => {
            res.status(400).json({ msg: `Error: ${error}`});
        })
    }
)

// POST - Create new comment on post.
router.post('/add_comment',

    body('commentContent').isLength({ min: 1 }).withMessage('Your comment cannot be empty.'),

    (req, res, next) => {

        console.log(req.body);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors : errors.array() });
        }

        Post.updateOne(
            { _id : req.body.postid },
            { $push : 
                { postComment : 
                    {
                        'comment' : req.body.commentContent,
                        'commentAuthorName' : req.body.username,
                        'commentAuthorID' : req.body.userID,
                        'commentLikes' : []
                    }
                }
            }
        )
        .then(result => {
            console.log(result);
            res.status(200).json({ msg : 'Comment Added'});
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ msg: `Error: ${error}`});
        })
    }
);

// PUT - Delete a comment. 
router.put('/delete_comment', 
    (req, res, next) => {
        console.log(req.body);
        Post.updateOne(
            { _id : req.body.postid },
            { $pull : { postComment : { _id : mongoose.Types.ObjectId(req.body.commentid)}}
        })
        .then(result => {
            console.log(result);
            res.status(200).json({ 'msg' : 'Comment has been deleted.'});
        })
        .catch(error => {
            res.status(400).json({ msg: `Error: ${error}`});
        })
    }
);

// PUT - Like a comment.
router.put('/like_comment', 

    (req, res, next) => {
        Post.updateOne(
            { _id : req.body.postid,  'postComment._id' : req.body.commentid }, 
            { $addToSet : { 'postComment.$.commentLikes' : mongoose.Types.ObjectId(req.body.userid)}
        })
        .then(result => {
            console.log(result);
            if (result.matchedCount === 1 && result.modifiedCount === 0) {
                res.status(200).json({ msg : 'You have already liked this post.'});
            } 
            else {
                res.status(200).json({ msg : 'Post has been liked'});
            }

        })
        .catch(error => {
            res.status(400).json({ msg: `Error: ${error}`});
        })
    }
);

// PUT - Unlike a comment.
router.put('/unlike_comment',

    (req, res, next) => {
        console.log(req.body);
        Post.updateOne(
            { _id : req.body.postid,  'postComment._id' : req.body.commentid }, 
            { $pull : { 'postComment.$.commentLikes' : mongoose.Types.ObjectId(req.body.userid)}
        })
        .then(result => {
            console.log(result);
            if (result.matchedCount === 1 && result.modifiedCount === 0) {
                res.status(200).json({ msg : 'You have already liked this post.'});
            } 
            else {
                res.status(200).json({ msg : 'Post has been liked'});
            }

        })
        .catch(error => {
            res.status(400).json({ msg: `Error: ${error}`});
        })
    }
);




module.exports = router;
