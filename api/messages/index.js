'use strict';

var express = require('express');
var controller = require('./messages.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.post('/:id', controller.show);
router.post('/room/:room_id', controller.all);

module.exports = router;