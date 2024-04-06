module.exports = function(app) {
    app.get('/api/hello', (_, res) => {
        res.send('Hello world');
    })
}