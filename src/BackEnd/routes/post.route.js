const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');

const posts = require("../models/post.model");


router.get('/api/posts', async (req, res) => {
    res.json(await posts.find({}));
});

router.get('/api/posts/:slug', async (req, res) => {
    const blog = await posts.findOne({
        slug: req.params.slug
    })
    res.json(blog);
});


router.post("/api/post", verifyToken, async (req, res) => {
    try {
        const post = {
            title: req.body.title,
            description: req.body.description,
            author: req.user.id 
        };
        const newPost = new posts(post);
        await newPost.save();
        res.status(200).json({ 
            success: true,
            message: "Posted successful"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating post",
            error: error.message
        });
    }
});

router.post('/api/posts/:slug/comments', verifyToken, async (req, res) => {
    try {
        const blog = await posts.findOne({
            slug: req.params.slug
        });

        if(!blog) {
            return res.status(404).json({ 
                success: false,
                message: 'Blog not found' 
            });
        } 
        
        const comment = {
            text: req.body.text,
            user: req.user.id 
        };

        blog.comments.push(comment);
        await blog.save();

        res.status(200).json({ 
            success: true,
            message: "Commented successful" 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding comment",
            error: error.message
        });
    }
});

router.post("/api/feedback", verifyToken, async (req, res) => {
    try {
        const post = {
            title: req.body.title,
            description: req.body.description,
            user: req.user.id 
        };

        const newPost = new posts(post);
        await newPost.save();

        res.status(200).json({ 
            success: true,
            message: "Feedback submitted successfully" 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error submitting feedback",
            error: error.message
        });
    }
});

module.exports = router;