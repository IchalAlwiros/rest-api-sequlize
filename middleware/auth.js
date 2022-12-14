const jwt = require('jsonwebtoken')
require('dotenv').config();
const {JWT_SECRET} = process.env

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        // Jika ada header authorization yang di kirimkan
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({
                    message: "Invalid Token"
                })
            }
            req.user = user
            next();
        })
    } else {
        return res.status(401).json({
            message: "Invalid or Expired Token"
        })
    }
}

module.exports = {
   authenticateToken
}