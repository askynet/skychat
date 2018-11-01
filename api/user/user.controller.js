var User = require('./user.model');
var randomstring = require("randomstring");

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
    return User.find().exec()
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
  
  // Creates a new Rooms in the DB
  const create= function create(req, res) {
       console.log(req.body);
      if (req.body.email &&
        req.body.username &&
        req.body.password ) {
        req.body.token=randomstring.generate();
        var userData = req.body;
    
        User.create(userData, function (error, user) {
          if (error) {
            console.log(error);
            var err = new Error('Something went wrong.');
            err.status = 401;
            if(error.code==11000){
              err.msg='Userdata already present.';
            }else
            err.msg='Something went wrong.';
            return  res.status(401).send(err);
          } else {
            var userid=user._id;
            User.findOne({ _id: userid }, ' -password').exec()
            .then(user => {
              if (!user) {
                return res.status(401).end();
              } else {
                res.json(user);
              }
            })
            .catch(err =>{
              return res.status(405).end();
            });
          }
        });
    
      } else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
          if (error || !user) {
            console.log(error);
            var err = new Error('Wrong email or password.');
            err.status = 401;
            err.msg='Wrong email or password.';
            return  res.status(401).send(err);
          } else {
            var userid=user._id;
           User.findOne({ _id: userid }, ' -password').exec()
           .then(user => {
             if (!user) {
               return res.status(401).end();
             } else {
               res.json(user);
             }
           })
           .catch(err =>{
             return res.status(405).end();
           });
          }
        });
      } else {
        var err = new Error('All fields required.');
        err.status = 400;
        err.msg='Parameters missing';
        return  res.status(400).send(err);
      }
  }

  const profile=function profile(req,res){
      var userid=req.body.userid;
      var token=req.body.token;
      console.log(req.body);
      return  User.findOne({ _id: userid,token:token }, ' -password').exec()
      .then(user => {
        if (!user) {
          return res.status(401).end();
        } else {
          res.json(user);
        }
      })
      .catch(err =>{
        return res.status(405).end();
      });
  }
  
  module.exports={
      index,
      create,
      profile
  }
  