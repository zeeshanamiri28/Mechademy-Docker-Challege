const _ = require('lodash');
const passport = require('passport');
const config = require('../utils/config');
const userModel = require('../service/user.service');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const tokenExtractor = function (req) {
    return req.headers['token'];
};

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromExtractors([tokenExtractor]);
opts.secretOrKey = config.secretkey;

const strategy = new JwtStrategy(opts, async function (jwt_payload, done) {
    let user = await userModel.ifUserExists(jwt_payload.data._id);
    if (!_.isNull(user)) {
        return done(null, user);
    }
    else {
        return done(null, false);
    }
});

passport.use(strategy);