const express = require('express');
const router = express.Router();

const { blogs, users } = require('../data/data.js'); 

router.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (users.some(user => user.username === username && user.password === password)) {
        res.json({ 
            success: true, 
            message: 'Đăng nhập thành công'
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Tên đăng nhập hoặc mật khẩu không đúng' 
        });
    }
});

router.get('/api/posts', (req, res) => {
    res.json(blogs);
});

router.get('/api/posts/:slug', (req, res) => {
    const blog = blogs.find(b => b.slug === req.params.slug);
    res.json(blog);
});

router.post("/api/post", (req, res) => {
    const post = {
        slug: req.body.slug,
        title: req.body.title,
        description: req.body.description
    };
    blogs.push(post);
    res.status(200).send({ message: "Posted successful" });
});

module.exports = router;