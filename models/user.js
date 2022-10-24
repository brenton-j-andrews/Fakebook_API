let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

let UserSchema = new Schema({
    email : { type: String, required: true, unique: true },
    password : { type: String, required: true, select: true }
});

// Hash user password.
UserSchema.pre(
    'save',
    async function(next) {
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);

        this.password = hash;
        next();
    }
)

// Compare password.
UserSchema.methods.isValidPassword = async function(password) {
    console.log("Argument: " +  password)
    const user = this;
    console.log("user password: " + user.password);
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;