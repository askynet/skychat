var Messages = require('./messages.model');

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
  
  // Gets a list of Messagess
 module.exports.index= function index(req, res) {
    return Messages.find().exec()
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
  
  // Creates a new Messages in the DB
 module.exports.create= function create(req, res) {
       console.log(req.body);
    return Messages.create(req.body)
      .then(respondWithResult(res, 201))
      .catch(handleError(res));
  }
  
 module.exports.show= function show(req, res) {
    var messageid=req.params.id;
    return Messages.find({_id:messageid}).exec()
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
  
 module.exports.all= function all(req, res) {
    var room_id=req.params.room_id;
    return Messages.find({room:room_id,active:true}).exec()
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
  

  