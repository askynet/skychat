var Rooms = require('./rooms.model');
var mongoose=require('mongoose');

var express = require("express")
var app = express()
var http = require("http").Server(app)
var io = require("socket.io")(http)
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
  
  // Gets a list of Rooms
  module.exports.index= function index(req, res) {
    return Rooms.find().exec()
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
  
  // Creates a new Rooms in the DB
  module.exports.create= function create(req, res) {
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
      .then(room=>{
        console.log(room);
        res.sendStatus(200).json(room);
        io.emit("rooms",room);
      })
      .catch(handleError(res));
  }

  module.exports.userrooms=function userrooms(req,res){
    try{
    var userid=mongoose.Types.ObjectId(req.params.userid);
    console.log(userid);
    return Rooms.find({ members: { $elemMatch: { user: userid } } } ).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
  }catch(e){
    res.status(204).end();
  }
  }
  
  