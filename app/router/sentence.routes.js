const pool = require('../../middleware/pg');
const verifyController = require('../controller/auth/verify.controller');

module.exports = function (app) {
    // 単語の一覧表示
    app.get('/api/sentences', verifyController,  async (_, res) => {
        try {
            const client = await pool.connect(); // プールからクライアントを取得

            try {
                const result = await client.query('SELECT * FROM sentences order by id');
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
    app.post('/api/sentences',  verifyController, async (req, res) => {
        const { wordId, sentence, translation } = req.body;
        
        try {
            const client = await pool.connect(); // プールからクライアントを取得

            try {
                await client.query('INSERT INTO sentences (word_id, sentence, translation) VALUES ($1, $2, $3)', [wordId, sentence, translation]);
                res.status(201).json({ message: 'Sentence registered successfully' });
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
    app.put('/api/sentences/:id', verifyController, async (req, res) => {
        const { id } = req.params;
        const { sentence, translation } = req.body;
        
        try {
            const client = await pool.connect(); // プールからクライアントを取得

            try {
                await client.query('UPDATE sentences SET sentence = $1, translation = $2 WHERE id = $3', [sentence, translation, id]);
                res.status(200).json({ message: 'Sentence updated successfully' });
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
    app.delete('/api/sentences/:id', verifyController, async (req, res) => {
        const { id } = req.params;
        try {
            const client = await pool.connect(); // プールからクライアントを取得

            try {
                await pool.query('DELETE FROM sentences WHERE id = $1', [id]);
                res.status(200).json({ message: 'Sentence deleted successfully' });
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