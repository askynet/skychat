var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var randomstring = require("randomstring");

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  active:{type:Boolean,default:true},
  createon:{type:Date,default: Date.now},
  lastview:{type:Date,default: Date.now},
  isOnline:{type:Boolean,default:false}
});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          var token=randomstring.generate();
          User.findOneAndUpdate({_id: user._id}, {$set:{token:token}}, {new: true}, (err, updatedUser) => {
            if (err) {
              var err = new Error('User not found.');
              err.status = 401;
              return callback(err);
            }
            return callback(null, updatedUser);
        });
        } else {
          return callback();
        }
      })
    });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.token=randomstring.generate();
    console.log(user.token);
    user.password = hash;
    next();
  })
});


var User = mongoose.model('User', UserSchema);
module.exports = User;