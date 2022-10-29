let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email : { type: String, required: true, unique: true },
    salt : { type: String },
    hash : { type: String }
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
