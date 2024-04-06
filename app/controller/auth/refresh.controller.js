const pool = require('../../../middleware/pg');
const jwt = require('../../../middleware/jwt');

module.exports = async function (req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).send('Refresh token is required');
    }

    try {
        const client = await pool.connect(); // プールからクライアントを取得
        try {
            jwt.verifyRefreshToken(refreshToken, async (err, decoded) => {
                if (err) {
                    return res.status(403).send('Refresh token is invalid');
                }
                // ユーザが存在するかチェック
                const user = await pool.query('SELECT * FROM Users WHERE id = $1', [decoded.id]);
                if (user.rows.length === 0) {
                    return res.status(404).send('User not found');
                }
                const newAccessToken = jwt.createToken({ email: decoded.email, id: decoded.id });
                res.json({ accessToken: newAccessToken });
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Error verify by token');
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json('Failed to connect to the database ');
    }
};