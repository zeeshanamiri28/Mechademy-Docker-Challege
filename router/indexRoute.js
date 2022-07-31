// defining express pre-requisities
const express = require('express');
const passport = require('passport');
const authenticate = require('../middlewares/passport');
const userController = require('../controllers/userController');
const blockController = require('../controllers/blockController');

const router = express.Router();

// user controller
router.route('/signup').post(userController.user);
router.route('/login/username/:username/password/:password').get(userController.login);
router.route('/peers').get(passport.authenticate('jwt', { session: false }), userController.getPeers);

// chain controller
router.route('/blockchain').post(passport.authenticate('jwt', { session: false }), blockController.addBlock);
router.route('/blockchain/:userId').get(passport.authenticate('jwt', { session: false }), blockController.getChain);

module.exports = router;
