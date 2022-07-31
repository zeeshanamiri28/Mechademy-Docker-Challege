const _ = require('lodash');
const jwt = require('jsonwebtoken');
const utils = require('../utils/index');
const config = require('../utils/config');
const userService = require('../service/user.service');

exports.user = async (req, res) => {
    const user = _.pick(req.body, ['firstName', 'lastName', 'mobileNumber', 'emailId', 'password']);
    const isValidUser = await utils.validateUser(user);
    if (isValidUser.success) {
        const saveUser = await userService.save(user);
        if (saveUser.success) {
            return utils.success(res, saveUser.data);
        }
        return utils.error(res, saveUser.error);
    }
    return utils.error(res, isValidUser.error);
};

exports.login = async (req, res) => {
    const cred = _.pick(req.params, ['username', 'password']);
    const logUser = await userService.login(cred);
    if (logUser.success) {
        const token = jwt.sign({ data: logUser.data }, config.secretkey, { expiresIn: config.authTokenExpirationTime });
        const data = logUser.data;
        res.status(200).json({ success: true, data, token: `${token}` });
    }
    else {
        return utils.error(res, logUser.error);
    }
};

exports.getPeers = async (req, res) => {
    const allUsers = await userService.getUsers();
    return utils.success(res, allUsers);
};

