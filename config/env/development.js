// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'development' environment configuration object
module.exports = {
	sessionSecret: 'developmentSessionSecret',
    pg: {
        user: 'your_database_user',
        host: 'localhost',
        database: 'your_database_name',
        password: 'your_database_password',
        port: 5432,
    },
    crypt:{
        saltRounds: 10
    },
    jwt:{
        secretKey : 'your_jwt_secret',
        refreshTokenKey: 'your_refresh_secret_key',
        expireTime: '12h',
        refreshExpireTime: '7d',
    },
    port: 3000

};