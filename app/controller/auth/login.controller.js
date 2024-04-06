const pool = require('../../../middleware/pg');
const crypt = require('../../../middleware/crypt');
const jwt = require('../../../middleware/jwt');

module.exports = async function (req, res) {

    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (!email || !password) {
        return res.status(400).json('email and password cannot be empty');
    }

    try {
        const client = await pool.connect(); // プールからクライアントを取得

        try {
            const result = await client.query('SELECT id, email, password FROM Users WHERE email = $1', [email]);
            if (result.rows.length === 0) {
                return res.status(401).send('Authentication failed');
            }
            const user = result.rows[0];
            const match = await crypt.match(password, user.password);
            if (!match) {
                return res.status(401).send('Authentication failed');
            }
            const accessToken = jwt.createToken({ email: user.email, id: user.id });
            const refreshToken = jwt.createRefreshToken({ email: user.email, id: user.id });
            res.json({ accessToken, refreshToken });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error logging in user');
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json('Failed to connect to the database ');
    }
};