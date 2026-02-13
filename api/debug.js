const app = require('../server/app');

module.exports = (req, res) => {
    // Direct debug information
    if (req.url.includes('health-check')) {
        return res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            url: req.url,
            headers: req.headers,
            env: {
                MONGO_URI_CONFIGURED: !!process.env.MONGO_URI,
                JWT_SECRET_CONFIGURED: !!process.env.JWT_SECRET
            }
        });
    }
    return app(req, res);
};
