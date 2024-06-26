const pool = require('../../middleware/pg');
const verifyController = require('../controller/auth/verify.controller');

module.exports = function (app) {
    // 単語の一覧表示
    app.get('/api/words', verifyController,  async (req, res) => {
        console.log(req.jwt);

        try {
            const client = await pool.connect(); // プールからクライアントを取得

            try {
                const result = await client.query('select w.id, w.word AS word, w.translate, COUNT(s.word_id) AS sentence FROM words w LEFT JOIN sentences s ON w.id = s.word_id GROUP BY w.id, w.word, w.translate ORDER BY w.id');
                res.status(200).json(result.rows);
            } catch (error) {
                console.error(error);
                res.status(400).json({ error: err.message });
            } finally {
                client.release();
            }
        } catch (err) {
            console.error('Database connection error:', err);
            res.status(500).json('Failed to connect to the database ');
        }
    });

    // 単語の新規登録
    app.post('/api/words',  verifyController, async (req, res) => {
        const { word, translate } = req.body;
        try {
            const client = await pool.connect(); // プールからクライアントを取得

            try {
                await client.query('INSERT INTO words (user_id, word, translate) VALUES ($1, $2, $3)', [req.user.id, word, translate]);
                res.status(201).json({ message: 'Word registered successfully' });
            } catch (error) {
                console.error(error);
                res.status(400).json({ error: err.message });
            } finally {
                client.release();
            }
        } catch (err) {
            console.error('Database connection error:', err);
            res.status(500).json('Failed to connect to the database ');
        }
    });

    // 単語の編集
    app.put('/api/words/:id', verifyController, async (req, res) => {
        const { id } = req.params;
        const { word, translate } = req.body;
        
        try {
            const client = await pool.connect(); // プールからクライアントを取得

            try {
                await client.query('UPDATE words SET user_id = $1, word = $2, translate = $3 WHERE id = $4', [req.user.id, word, translate, id]);
                res.status(200).json({ message: 'Word updated successfully' });
            } catch (error) {
                console.error(error);
                res.status(400).json({ error: err.message });
            } finally {
                client.release();
            }
        } catch (err) {
            console.error('Database connection error:', err);
            res.status(500).json('Failed to connect to the database ');
        }
    });

    // 単語の削除
    app.delete('/api/words/:id', verifyController, async (req, res) => {
        const { id } = req.params;
        try {
            const client = await pool.connect(); // プールからクライアントを取得

            try {
                await pool.query('DELETE FROM words WHERE id = $1', [id]);
                res.status(200).json({ message: 'Word deleted successfully' });
            } catch (error) {
                console.error(error);
                res.status(400).json({ error: err.message });
            } finally {
                client.release();
            }
        } catch (err) {
            console.error('Database connection error:', err);
            res.status(500).json('Failed to connect to the database ');
        }
    });
}