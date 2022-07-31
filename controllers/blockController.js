const _ = require('lodash');
const miner = require('../utils/miner');
const utils = require('../utils/index');
const blockService = require('../service/block.service');

exports.addBlock = async (req, res) => {
    const body = _.pick(req.body, ['id', 'data']);
    const isGenesisExists = await blockService.getChain(body.id);
    if (_.isEmpty(isGenesisExists)) {
        //make genesis
        let block = await miner.createGenesis(body.id);
        const saveGenesis = await blockService.save(block);
        if (saveGenesis.success) {
            //addnew
            const latestChain = await blockService.getChain(body.id);
            const lastBlock = latestChain[latestChain.length - 1];
            const newBlock = await miner.addNew(lastBlock, body, latestChain.length);
            const saveBlock = await blockService.save(newBlock);
            if (saveBlock.success) {
                return utils.success(res, saveBlock.data);
            }
            return utils.error(res, saveBlock.error);
        }
        return utils.error(res, saveGenesis.error);
    }
    else {
        //addnew
        const lastBlock = isGenesisExists[isGenesisExists.length - 1];
        const newBlock = await miner.addNew(lastBlock, body, isGenesisExists.length);
        const saveBlock = await blockService.save(newBlock);
        if (saveBlock.success) {
            //addnew
            return utils.success(res, saveBlock.data);
        }
        return utils.error(res, saveBlock.error);
    }
};

exports.getChain = async (req, res) => {
    const userId = _.pick(req.params, ['userId']);
    const chain = await blockService.getChain(userId.userId);
    return utils.success(res, chain);
};