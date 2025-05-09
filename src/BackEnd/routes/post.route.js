const express = require('express');
const router = express.Router();

const blogs = require("../models/blog.model")

router.get('/api/posts', async (req, res) => {
    res.json(await blogs.find({}));
});


router.post("/api/post", async (req, res) => {
    const post = {
        title: req.body.title,
        description: req.body.description
    };
    const newPost = new blogs(post);
    await newPost.save()
    res.status(200).send({ message: "Posted successful" });
});


router.get('/api/posts/:slug', async (req, res) => {
    const blog = await blogs.findOne({
        slug: req.params.slug
    })
    res.json(blog);
});


router.post('/api/posts/:slug/comments', async (req, res) => {
    const blog = await blogs.findOne({
        slug: req.params.slug
    });

    if(!blog) {
        return res.status(404).json({ message: 'Blog not found' });
    } 
    
    const comment = {
        text: req.body.text
    };
    blog.comments.push(comment);
    await blog.save()
    res.status(200).send({ message: "Commented successful" });
});

module.exports = router;