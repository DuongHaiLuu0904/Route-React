const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const blogSchema = new mongoose.Schema(
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

const Blog = mongoose.model('Blog', blogSchema, 'blogs');
module.exports = Blog;