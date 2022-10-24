let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    first : { type: String, required: true },
    last : { type: String, required: true },
    email : { type: String, required: true, unique: true },
    password : { type: String, required: true, select: false }
});


module.exports = mongoose.model('user', UserSchema);