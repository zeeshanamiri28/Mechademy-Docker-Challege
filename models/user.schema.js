const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');
const utils = require('../utils/index');
const message = require('../utils/message');

mongoose.set('useCreateIndex', true);

const userSchema = mongoose.Schema({
    createdAt: Date,
    updatedAt: Date,
    password: {
        type: String,
        required: [true, message.PASSWORD_REQUIRED_ERROR]
    },
    firstName: {
        type: String,
        trim: true,
        required: [true, message.FIRST_NAME_REQUIRED_ERROR]
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, message.LAST_NAME_REQUIRED_ERROR]
    },
    gender: {
        type: String,
        lowercase: true,
        trim: true
    },
    emailId: {
        type: String,
        required: [true, message.EMPTY_EMAIL_ERROR],
        unique: [true, message.REGISTERED_EMAIL_ERROR],
        validate: [
            {
                validator: value => validator.isEmail(value),
                message: '{VALUE} is not a valid emailId!',
            },
        ],
        lowercase: true,
        trim: true
    },
    mobileNumber: {
        type: String,
        required: [true, message.EMPTY_MOBILE_ERROR],
        unique: [true, message.REGISTERED_MOBILE_ERROR],
        validate: [
            {
                validator: value => utils.isValidNumber(value),
                message: '{VALUE} is not a valid Mobile number!',
            },
        ]

    }
});

userSchema.index({ mobileNumber: 1, emailId: 1 });

userSchema.pre('save', function (next) {
    const user = this;
    user.createdAt = new Date().toISOString();
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.toJSON = function () {
    // console.log('Entering toJSON()');
    const user = this;
    const userObject = user.toObject();
    delete userObject['password'];
    return userObject;
};

userSchema.statics.findByCredentials = async function (userName) {
    console.log(`Entering findByCredentials() with userName: ${userName}`);
    if (_.isUndefined(userName)) {
        console.log('yes undefined');
        return null;
    }
    let user = {};
    try {
        if (_.isEmpty(user)) {
            user = await this.findOne({ mobileNumber: userName });
        }
        if (_.isEmpty(user)) {
            user = await this.findOne({ emailId: userName });
        }
        if (_.isEmpty(user)) {
            user = await this.findOne({ _id: userName });
        }
    } catch (error) {
        // console.log('error occure while login=>', error);
        return null;
    }
    // console.log(user);
    return user;
};

userSchema.statics.fetchUsers = async function () {
    try {
        return await this.find({});
    }
    catch (error) {
        return null;
    }
};

module.exports = mongoose.model('sandeep_user', userSchema);
