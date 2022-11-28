let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email : { type: String, required: true, unique: true },
    salt : { type: String },
    hash : { type: String },
    friends : [{ type: Schema.Types.ObjectId, ref: 'User'}],
    friendRequests : [{ type: Schema.Types.ObjectId, ref: 'User'}]
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
