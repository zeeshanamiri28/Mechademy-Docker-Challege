const _ = require('lodash');
const validator = require('validator');
const message = require('../utils/message');
const httpStatus = require('http-status-codes');
const userService = require('../service/user.service');

validateUser = async (user) => {
    if (!_.isNull(await userService.ifUserExists(user.mobileNumber))) {
        return { success: false, error: message.REGISTERED_MOBILE_ERROR };
    }
    if (!_.isNull(await userService.ifUserExists(user.emailId))) {
        return { success: false, error: message.REGISTERED_EMAIL_ERROR };
    }
    return { success: true };
};

isValidNumber = async (mobileNumber) => {
    if (validator.isNumeric(mobileNumber) && validator.isLength(mobileNumber, { min: 10, max: 10 })) {
        return true;
    }
    return false;
};

resolve = (error) => {
    for (const key in error.errors) {
        return (error.errors[key].message);
    }
};

error = (res, message) => {
    return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        error: {
            code: httpStatus.BAD_REQUEST,
            message: message
        }
    });
};

success = (res, message) => {
    return res.status(httpStatus.OK).json({
        success: true,
        data: message
    });
};

exports.error = error;
exports.resolve = resolve;
exports.success = success;
exports.validateUser = validateUser;
exports.isValidNumber = isValidNumber;