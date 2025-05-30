const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const postSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        comments: Array,
        slug: {
            type: String, 
            slug: "title", 
            unique: true
        }
    }, 
    { timestamps: true }
);

const Post = mongoose.model('Post', postSchema, 'posts');
module.exports = Post;