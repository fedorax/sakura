
const config = require('../config/config');
const jwt = require('jsonwebtoken');

exports.createToken = function(payload){
    return jwt.sign(payload, config.jwt.secretKey, { expiresIn: config.jwt.expireTime })
}

exports.createRefreshToken = function(payload){
    return jwt.sign(payload, config.jwt.refreshTokenKey, { expiresIn: config.jwt.refreshExpireTime });   
}

exports.verifyToken = function(token, callback) {
    return jwt.verify(token, config.jwt.secretKey, callback);
}

exports.verifyRefreshToken = function(refreshToken, callback) {
    return jwt.verify(refreshToken, config.jwt.refreshTokenKey, callback);
}