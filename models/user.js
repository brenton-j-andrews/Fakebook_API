let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

let UserSchema = new Schema({
    email : { type: String, required: true, unique: true },
    salt : { type: String },
    hash : { type: String }
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
