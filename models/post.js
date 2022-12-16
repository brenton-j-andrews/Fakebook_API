/* 
    The post model structures user posts and comments.
*/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PostSchema = new Schema({
    'postContent' : { type: String, required: true },
    'postAuthor' : { type: Schema.Types.ObjectId, ref: 'User'}
})

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;