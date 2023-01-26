/* 
    All routes pertaining to fetching user data and friend request CRUD operations.
*/

var express = require("express");
var router = express.Router();
const passport = require('passport');
let mongoose = require('mongoose');

// Model, function, middleware imports.
const User = require('../models/user');
const utilities = require('../utilities/authenticationUtilities')

require('../config/database');

// GET - Signed in user data for profile page. Get friend data if friend_id header is present.
router.get('/profile', passport.authenticate('jwt', {session: false}), 

    (req, res, next) => {

        if (req.headers.friendid) {
            userQueryId = req.headers.friendid;
        } else {
            userQueryId = req.headers.userid;
        }

        User.findById({ _id : userQueryId }, { salt : 0, hash : 0})
        .populate('friends', ['firstName', 'lastName'])
        .populate('userPosts')
        .then((result) => {
            res.send(result)
        })
        .catch((error) => {
            res.send(error);
        })
    }
);

// POST - Display other users on clicking the search bar, filtering by search string and returning the result to client. Add AUTH later?
router.post('/profile/search',
    (req, res, next) => {
        User.find({ firstName : {$regex : req.body.string, $options:'i'}})
        .then((result) => {
            res.send(result);
        })
    }
);

// POST - Send friend request to another user. 
router.post('/friend_request', passport.authenticate('jwt', {session: false}),

    async (req, res, next) => {
        const recipient_id  = req.body.recipient_id;
        const sender_id = req.body.user_id;

        try {
            const sender = await User.findById({ _id : sender_id });
            const recipient = await User.findById({ _id : recipient_id });

            // If recipient is already a friend. None of these options should be possible via the client, but just in case!
            if (sender.friends.includes(recipient_id)) {
                return res.status(400).json({ message : `You are already friends with ${recipient.fullName}.`});
            }

            // If the recipient is also the sender!
            else if (sender_id === recipient_id) {
                return res.status(400).json({ message : 'You cannot send a friend request to yourself.'});
            }

            // If request has already been sent to recipient.
            else if (sender.friendRequestsSent.includes(recipient_id)) {
                return res.status(400).json({ message : `You have already sent a friend request to ${recipient.fullName}.`});
            }

            // Else, push the requesting user's id to recipients received requests array and vice versa.
            else {
                recipient.friendsRequestsRecieved.push(sender_id);
                sender.friendRequestsSent.push(recipient_id);
                recipient.save();
                sender.save();
                return res.status(201).json({ message : `Friend Request Sent to ${recipient.fullName}.`});
            }
        }

        catch (error) {
            console.log(error);
            return res.status(500).json({ error : error.message });
        }
    }
);

// PUT - Accept friend request from another user.
router.put('/accept_request', passport.authenticate('jwt', {session: false}),

    async (req, res, next) => {

        const recipientID  = req.body.recipient_id;
        const senderID = req.body.sender_id;

        try {
            
            // Update request sender document. 
            await User.updateOne({ _id : senderID }, { 
                $addToSet : { friends : mongoose.Types.ObjectId(recipientID) }, 
                $pull : { friendRequestsSent : mongoose.Types.ObjectId(recipientID) }
            });

            // Update recipient document.
            await User.updateOne({ _id : recipientID }, {
                $addToSet : { friends :mongoose.Types.ObjectId(senderID) },
                $pull : { friendsRequestsRecieved : mongoose.Types.ObjectId(senderID) }
            });

            return res.status(201).json({ message : 'Friend accepted.'});
        }

        catch (error) {
            console.log('Error: ', error);
            return res.status(401).json({ message: error });
        }

    }
);

// PUT - Decline friend request from another user.
router.put('/decline_request', passport.authenticate('jwt', {session: false}),

    async (req, res, next) => {

        const recipientID  = req.body.recipientID;
        const senderID = req.body.senderID;

        try {
            // Update recipient user document. 
            await User.updateOne({ _id : recipientID }, {
                $pull : { friendsRequestsRecieved : mongoose.Types.ObjectId(senderID)}
            });

            // Update sender document.
            await User.updateOne({ _id : senderID }, {
                $pull : { friendRequestsSent : mongoose.Types.ObjectId(recipientID)}
            });

            res.status(201).json({ message : 'Friend Request Declined.'});
        }

        catch {
            console.log('Error: ', error);
            return res.status(401).json({ message: error });
        }
    }
);

// PUT - Cancel previously sent friend request.
router.put('/cancel_request',  passport.authenticate('jwt', {session: false}), 

    async (req, res, next) => {

        const recipientID  = req.body.recipientID;
        const senderID = req.body.senderID;

        try {
            // Update recipient user document. 
            await User.updateOne({ _id : senderID }, {
                $pull : { friendRequestsSent : mongoose.Types.ObjectId(recipientID)}
            });

            // Update sender document.
            await User.updateOne({ _id : recipientID }, {
                $pull : { friendsRequestsRecieved : mongoose.Types.ObjectId(senderID)}
            });

            res.status(201).json({ message : 'Friend Request Cancelled.'});
        }

        catch {
            console.log('Error: ', error);
            return res.status(401).json({ message: error });
        }

    }
)

// PUT - Unfriend another user.
router.put('/unfriend_user', passport.authenticate('jwt', {session: false}),

    async (req, res, next) => {
        const signedInID  = req.body.signedInID;
        const unfriendID = req.body.unfriendID;

        try {
            // Update signed in user document. 
            await User.updateOne({ _id : signedInID }, {
                $pull : { friends : mongoose.Types.ObjectId(unfriendID)}
            });

            // Update unfriended user document.
            await User.updateOne({ _id : unfriendID }, {
                $pull : { friends : mongoose.Types.ObjectId(signedInID)}
            });

            res.status(201).json({ message : 'Friend removed successfully.'});
        }

        catch {
            console.log('Error: ', error);
            return res.status(401).json({ message: error });
        }
    }
);

module.exports = router;

// 