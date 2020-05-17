const mongoose = require('mongoose');
const User = mongoose.model('User');
const Task = mongoose.model('Task');
const ObjectId = require('mongodb').ObjectId; 

module.exports.profileRead = (req, res) => {
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      message: 'UnauthorizedError: private profile'
    });
  } else {
    // Otherwise continue
    User.findById(req.payload._id).exec(function(err, user) {
      res.status(200).json(user);
    });
  }
};


module.exports.getUsers = (req, res) => {
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      message: 'UnauthorizedError: private profile'
    });
  } else {
    // Otherwise continue
    User.find().exec(function(err, user) {
      res.status(200).json(user);
    });
  }
};

module.exports.addTask = (req, res) => {
    var task = new Task(req.body);
     task.save().then(item => {
      res.send(200,({msg :"Task saved to database"}));
    })
    .catch(err => {
      res.send(404,({error :"something went wrong"},err));
    });
};

module.exports.getTask = (req, res) => {
  var userId = req.query['_id'];
  console.log(userId,'',req.query);
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      message: 'UnauthorizedError: private profile'
    });
  } else {
    // Otherwise continue { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] }
    Task.find({$or : [{ "assign_user": ObjectId(userId)} ,{ "task_creator" : ObjectId(userId)}]}).exec(function(err, task) {
      res.status(200).json(task);
    });
  }
};

module.exports.deleteTask = (req, res) => {
  var userId = req.query['_id'];
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      message: 'UnauthorizedError: private profile'
    });
  } else {
    // Otherwise continue
    Task.deleteOne({ "_id": ObjectId(userId) }).exec(function(err, task) {
      res.status(200).json(task);
    });
  }
};

module.exports.updateTask = (req, res) => {
  var userId = req.query['_id'];
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      message: 'UnauthorizedError: private profile'
    });
  } else {
    // Otherwise continue
    Task.updateOne({ "_id": ObjectId(userId)}, req.body).exec(function(err, task) {
      res.status(200).json(task);
    });
  }
};

module.exports.updateTaskStatus = (req, res) => {
  var userId = req.query['_id'];
  console.log(req.body);
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      message: 'UnauthorizedError: private profile'
    });
  } else {
    // Otherwise continue
    Task.updateOne({ "_id": ObjectId(userId)}, { $set:
      {
        is_active: req.body.status,
       
      }
    }).exec(function(err, task) {
      res.status(200).json(task);
    });
  }
};

module.exports.updateUserStatus = (req, res) => {
  var userId = req.query['_id'];
  console.log(req.body);
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      message: 'UnauthorizedError: private profile'
    });
  } else {
    // Otherwise continue
    User.updateOne({ "_id": ObjectId(userId)}, { $set:
      {
        is_prime: req.body.is_prime,
       
      }
    }).exec(function(err, task) {
      res.status(200).json(task);
    });
  }
};