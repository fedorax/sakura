const config = require('../config/config');
const bcrypt = require('bcrypt');

exports.match = async function(password, hashedPassword){
    return await bcrypt.compare(password, hashedPassword);
}

exports.hash = async function(password){
    return await bcrypt.hash(password, config.crypt.saltRounds);
}