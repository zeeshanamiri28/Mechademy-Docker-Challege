const _ = require('lodash');
const crypto = require('crypto');
const config = require('../utils/config');

module.exports = function (req, res, next) {
    try {
        const key = req.headers['x-api-key'];
        if (_.isEqual(key, config.apiKey)) {
            console.log('passed');
            next();
        }
        else {
            console.log('failed');
            return res.status(401).json({ success: false, error: { code: 403, message: 'FORBIDDEN_ACCESS' } });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, error: { code: 403, message: 'FORBIDDEN_ACCESS' } });
    }
};