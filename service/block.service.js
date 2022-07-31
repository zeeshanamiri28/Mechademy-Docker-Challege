const utils = require('../utils/index');
const chainModel = require('../models/block.schema');

save = async (block) => {
    console.log('Saving to DB-');
    return new Promise(async (resolve, reject) => {
        let chainData = new chainModel(block);
        chainData.save(async (error, response) => {
            if (error) {
                console.log("error", error);
                error = await utils.resolve(error);
                reject(error);
            }
            else {
                resolve({ success: true, data: response });
            }
        });
    }).catch((error) => {
        return ({ success: false, error: error });
    });
};

getLastBlock = async (id) => {
    return new Promise((resolve, reject) => {
        chainModel.find({ userid: id }, (error, res) => {
            if (error) {
                console.log(error);
                return reject(null);
            }
            return resolve({ success: true, data: res });
        });
    }).catch((error) => {
        console.log(error);
        return null;
    });
};

getChain = async (id) => {
    return await chainModel.getChain(id);
};

exports.save = save;
exports.getChain = getChain;
exports.getLastBlock = getLastBlock;