var Rooms = require('./rooms.model');

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
      if(entity) {
        return res.status(statusCode).json(entity);
      }
      return null;
    };
  }
  
  function removeEntity(res) {
    return function(entity) {
      if(entity) {
        return entity.remove()
          .then(() => {
            res.status(204).end();
          });
      }
    };
  }
  
  function handleEntityNotFound(res) {
    return function(entity) {
      if(!entity) {
        res.status(404).end();
        return null;
      }
      return entity;
    };
  }
  
  function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
      res.status(statusCode).send(err);
    };
  }
  
  // Gets a list of Roomss
  const index= function index(req, res) {
    return Rooms.find().exec()
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
  
  // Creates a new Rooms in the DB
  const create= function create(req, res) {
       console.log(req.body);
      var room={
        owner:req.body.owner,
        name:req.body.name,
        admins:[
          {
            user:req.body.owner
          }
        ],
        members:[
          {
            user:req.body.owner
          }
        ]

      }
    return Rooms.create(room)
      .then(respondWithResult(res, 201))
      .catch(handleError(res));
  }
  
  module.exports={
      index,
      create
  }
  