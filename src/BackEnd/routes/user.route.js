const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../data/database');
const { verifyToken } = require('../middleware/auth.middleware');

const User = require("../models/user.model");

router.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Tên đăng nhập và mật khẩu là bắt buộc'
        });
    }
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Tên đăng nhập đã tồn tại'
            });
        }

        const newUser = new User({
            username,
            password 
        });
        await newUser.save();
        const user = {
            id: newUser._id,
            username: newUser.username
        };

        jwt.sign(
            { user }, 
            JWT_SECRET, 
            { expiresIn: '24h' }, 
            (err, token) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'Lỗi khi tạo token'
                    });
                } else {
                    res.json({ 
                        success: true, 
                        message: 'Đăng ký thành công',
                        token
                    });
                }
            }
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi đăng ký người dùng',
            error: error.message
        });
    }
});

router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Tên đăng nhập và mật khẩu là bắt buộc'
        });
    }

    try {
        const checkUser = await User.find({
            username: username,
            password: password
        });

        if (checkUser.length > 0) {
            const user = {
                id: checkUser[0]._id,
                username: checkUser[0].username
            };
            jwt.sign(
                { user }, 
                JWT_SECRET, 
                { expiresIn: '24h' }, 
                (err, token) => {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: 'Lỗi khi tạo token'
                        });
                    } else {
                        res.json({ 
                            success: true, 
                            message: 'Đăng nhập thành công',
                            token 
                        });
                    }
                }
            );
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Tên đăng nhập hoặc mật khẩu không đúng' 
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi đăng nhập',
            error: error.message
        });
    }
});


router.get('/api/user/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});


module.exports = router;