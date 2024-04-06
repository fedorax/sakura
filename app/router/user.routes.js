const registerController = require('../controller/auth/register.controller');
const loginController = require('../controller/auth/login.controller');
const verifyController = require('../controller/auth/verify.controller');
const refreshController = require('../controller/auth/refresh.controller');
module.exports = function (app) {
    // ユーザー登録
    app.post('/register', registerController);

    // ユーザーログイン
    app.post('/login', loginController);

    // トークン検証エンドポイント
    app.get('/verify', verifyController);
    // アクセストークンのリフレッシュエンドポイント
    app.post('/refresh', refreshController);
}