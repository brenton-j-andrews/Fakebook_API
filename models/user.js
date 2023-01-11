let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email : { type: String, required: true, unique: true },
    firstName : { type: String, required: true },
    lastName : { type: String, required: true },
    salt : { type: String },
    hash : { type: String },
    friends : [{ type: Schema.Types.ObjectId, ref: 'User'}],
    friendRequestsSent : [{ type: Schema.Types.ObjectId, ref: 'User'}],
    friendsRequestsRecieved : [{ type: Schema.Types.ObjectId, ref: 'User'}],
    userPosts : [{ type: Schema.Types.ObjectId, ref: 'Post'}]
    
    // Activity log tracks user activity (friends added, posts created, comments added, posts liked.)
}, {
    toJSON: { virtuals: true },
    toObject : { virtuals: true }
});

UserSchema.virtual('fullName')
.get(function() { 
    return `${this.firstName} ${this.lastName}`
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
