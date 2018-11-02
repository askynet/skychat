'use strict';

var express = require('express');
var controller = require('./rooms.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.get('/:userid', controller.userrooms);

module.exports = router;