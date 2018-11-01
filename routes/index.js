const routes = require('express').Router();
const rooms = require('../api/rooms');
const user =require('../api/user');
const messages=require('../api/messages');

routes.use('/rooms', rooms);
routes.use('/user', user);
routes.use('/messages', messages);

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

module.exports = routes;
