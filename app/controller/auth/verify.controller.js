const pool = require('../../../middleware/pg');
const jwt = require('../../../middleware/jwt');

module.exports = async function (req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).send('Token is missing');
    }

    try {
        const client = await pool.connect(); // プールからクライアントを取得

        try {
            jwt.verifyToken(token, async (err, decoded) => {
                if (err) {
                    return res.status(401).send('Token is invalid or expired');
                }
                // ユーザが存在するかチェック
                const ret = await pool.query('SELECT id, email FROM Users WHERE email = $1', [decoded.email]);
                if (ret.rows.length === 0) {
                    return res.status(404).send('User not found');
                }
                req.jwt = decoded;
                req.user = ret.rows[0];
                next();
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