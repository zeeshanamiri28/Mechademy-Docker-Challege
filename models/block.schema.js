const _ = require('lodash');
const mongoose = require('mongoose');
const validator = require('validator');
const utils = require('../utils/index');
const message = require('../utils/message');

mongoose.set('useCreateIndex', true);

const chainSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        required: [true, message.CREATION_DATE_REQUIRED_ERROR]
    },
    userId: {
        type: String,
        require: [true, message.USER_ID_REQUIRED]
    },
    index: {
        type: Number,
        required: [true, message.INDEX_REQUIRED_ERROR]
    },
    data: {
        type: String,
        trim: true,
        required: [true, message.DATA_REQUIRED_ERROR]
    },
    prevHash: {
        type: String,
        trim: true,
        default: null
    },
    currentHash: {
        type: String,
        trim: true,
        required: [true, message.CURRENT_HASH_REQUIRED_ERROR]
    },
    nonce: {
        type: String,
        // required: [true, message.NONCE_REQUIRED_ERROR],
        trim: true
    }
});

chainSchema.statics.getChain = async function (id) {
    let chain;
    try {
        chain = await this.find({ userId: id });
    } catch (error) {
        return null;
    }
    return chain;
};

module.exports = mongoose.model('sandeep_chain', chainSchema);
