const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../data/database');

function verifyToken(req, res, next) {  
    const bearerHeader = req.headers['authorization']; // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    
    if (typeof bearerHeader !== 'undefined') {
        try {
            const bearer = bearerHeader.split(' ');

            if (bearer.length !== 2 || bearer[0] !== 'Bearer') {
                return res.status(401).json({
                    success: false,
                    message: 'Định dạng Authorization không hợp lệ'
                });
            }
            
            const bearerToken = bearer[1];

            jwt.verify(bearerToken, JWT_SECRET, (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        return res.status(401).json({
                            success: false,
                            message: 'Token đã hết hạn, vui lòng đăng nhập lại'
                        });
                    }
                    
                    return res.status(403).json({
                        success: false,
                        message: 'Token không hợp lệ'
                    });
                } else {
                    req.user = decoded.user;
                    next();
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Lỗi xác thực'
            });
        }
    } else {
        res.status(401).json({
            success: false,
            message: 'Không có quyền truy cập, vui lòng đăng nhập'
        });
    }
}

module.exports = { verifyToken };
