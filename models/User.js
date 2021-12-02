var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');
let Profile = require('./Profile');
require('dotenv').config();

var userSchema = new Schema(
  {
    email: { type: String, unique: true, require: true },
    username: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    bio: { type: String },
    name: { type: String },
    image: { type: String },
    profile: { type: mongoose.Types.ObjectId, ref: 'Profile' },
    questions: [{ type: mongoose.Types.ObjectId, ref: 'Question' }],
    answers: [{ type: mongoose.Types.ObjectId, ref: 'Answer' }],
    followers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  try {
    console.log(this);
    this.password = await bcrypt.hash(this.password, 10);
    let data = {
      name: this.name,
      username: this.username,
      bio: this.bio,
      image: this.image,
      isAdmin: this.isAdmin,
      isBlocked: this.isBlocked,
    };
    createdProfile = await Profile.create(data);
    this.profile = createdProfile.id;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verifyPassword = async function (password, cb) {
  try {
    var result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    return error;
  }
};

userSchema.methods.signToken = async function () {
  try {
    let profile = await Profile.findById(this.profile);
    console.log(profile, 'profile');
    let payload = {
      userId: profile._id,
      name: profile.name,
      username: profile.username,
      bio: profile.bio,
      image: profile.image,
    };

    console.log(payload, 'payload');

    let user = await User.findOne({ username: profile.username });
    if (user.isAdmin) {
      payload.isAdmin = true;
    } else {
      payload.isAdmin = false;
    }
    var token = await jwt.sign(payload, process.env.SECRET);
    return token;
  } catch (error) {
    return error;
  }
};

userSchema.methods.userJSON = function (token) {
  return {
    email: this.email,
    username: this.username,
    token: token,
  };
};

var User = mongoose.model('User', userSchema);

module.exports = User;