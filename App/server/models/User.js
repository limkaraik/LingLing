const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50
    },
    email: {
        type:String,
        trim:true,
        unique: 1 
    },
    password: {
        type: String,
        minlength: 5
    },
    meeting:{
        type: mongoose.Schema.Types.Mixed,
        default:{}
    },
    token: {
        type: String
    }
})

userSchema.index(
    {
      name: 'text',
      email: 'text',
    },
    {
      weights: {
        name: 5,
        email: 3,
      },
    }
  );

userSchema.methods.generateToken = function (cb) {
    var user = this;
    const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '32h' });
    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    });
};

userSchema.statics.findByToken = function (token, cb) {
    var user = this;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decode) {
        user.findOne({ _id: decode, token: token }, function (err, user) {
        if (err) return cb(err);
        cb(null, user);
        });
    });
};

const User = mongoose.model('User', userSchema);

module.exports = { User }