const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://cooking-by-myself.herokuapp.com',
            changeOrigin: true
        })
    );
};