const pool = require('../../../middleware/pg');
const crypt = require('../../../middleware/crypt');

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
            const existingUser = await client.query('SELECT id FROM Users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                console.log('email already exists');
                client.release();
                return res.status(400).json('email already exists');
            }

            const hashedPassword = await crypt.hash(password);
            const result = await client.query('INSERT INTO Users(email, password) VALUES($1, $2)', [email, hashedPassword]);
            
            if(result.rowCount && result.rowCount === 1){
                res.status(201).json('User successfully registered');
            } else {
                throw new Error('Faild to insert User into Users table.')
            }
        } catch (error) {
            console.error(error);
            res.status(500).json('Error registering new user');
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json('Failed to connect to the database ');
    }

};