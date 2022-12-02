let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email : { type: String, required: true, unique: true },
    firstName : { type: String, required: true },
    lastName : { type: String, required: true },
    salt : { type: String },
    hash : { type: String },
    friends : [{ type: Schema.Types.ObjectId, ref: 'User'}],
    friendRequests : [{ type: Schema.Types.ObjectId, ref: 'User'}],
}, {
    toJSON: { virtuals: true }
});

UserSchema.virtual('fullName')
.get(function() { 
    return `${this.firstName} ${this.lastName}`
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
