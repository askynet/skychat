'use strict';

const mongoose = require('mongoose');

var MessagesSchema = new mongoose.Schema({
  owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  room:{type:mongoose.Schema.Types.ObjectId,ref:'Rooms',required:true},
  mention:[
      {
          user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
          name:String
      }
  ],
  text:String,
  active:{type:Boolean,default:true},
  posted:{type:Date,default: Date.now}
});

module.exports= mongoose.model('Messages', MessagesSchema);
