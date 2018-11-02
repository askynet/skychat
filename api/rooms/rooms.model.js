'use strict';

const mongoose = require('mongoose');

var RoomsSchema = new mongoose.Schema({
  name:String,
  owner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  admins:[
      {
          user:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
      }
  ],
  members:[
    {
        user:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
    }
  ],
  private:{type:Boolean,default:false},
  active:{type:Boolean,default:true},
  createon:{type:Date,default: Date.now},
  updateon:{type:Date,default: Date.now},
});

module.exports= mongoose.model('Rooms', RoomsSchema);
