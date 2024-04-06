const pool = require('../../middleware/pg');
module.exports = function (app) {
    app.get('/sql', async (_, res) => {
        try {
            const client = await pool.connect(); // プールからクライアントを取得

            try {
                // SELECT文のクエリ
                //const query = 'SELECT * FROM users';
                const query = 'SELECT NOW()';

                // クエリを実行して結果を取得
                const result = await client.query(query);

                // 結果を表示
                console.log(result.rows); // 行の配列が表示される

                res.json(result.rows);
            } catch (err) {
                console.error('Query execution error:', err);
                res.status(500).send('Database query failed');
              } finally {
                client.release();
              }
        } catch (err) {
            console.error('Database connection error:', err);
            res.status(500).send('Failed to connect to the database');
        }
        return res;
    })
}