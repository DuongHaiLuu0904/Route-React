const express = require('express');
const router = express.Router();

const User = require("../models/user.model");

router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const checkUser = await User.find({
        username: username,
        password: password
    })

    if (checkUser.length > 0) {
        res.json({ 
            success: true, 
            message: 'Đăng nhập thành công'
        });
    } else {
        res.status(404).json({ 
            success: false, 
            message: 'Tên đăng nhập hoặc mật khẩu không đúng' 
        });
    }
});


module.exports = router;