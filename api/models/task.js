// const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  completion_date: {
    type: String,
  },
  detail: {
    type: String,
    required: true
  },
  assign_user: {
    type: String,
    required: true
  },
  task_creator: {
    type: String,
    required: true
  },
  is_active: {
    type: Boolean,
    required: true
  }
});

// userSchema.methods.setPassword = function(password) {
//   this.salt = crypto.randomBytes(16).toString('hex');
//   this.hash = crypto
//     .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
//     .toString('hex');
// };

// userSchema.methods.validPassword = function(password) {
//   const hash = crypto
//     .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
//     .toString('hex');
//   return this.hash === hash;
// };

// userSchema.methods.generateJwt = function() {
//   const expiry = new Date();
//   expiry.setDate(expiry.getDate() + 7);

//   return jwt.sign(
//     {
//       _id: this._id,
//       email: this.email,
//       name: this.name,
//       exp: parseInt(expiry.getTime() / 1000)
//     },
//     'MY_SECRET'
//   ); 
// };

mongoose.model('Task', taskSchema,'tasks');
