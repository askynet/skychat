'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.get('/profile', controller.profile);

module.exports = router;