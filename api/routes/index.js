const ctrlAuth = require('../controllers/authentication');
const ctrlProfile = require('../controllers/profile');
const express = require('express');
const jwt = require('express-jwt');
const router = express.Router();

const auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});


// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.get('/users', auth, ctrlProfile.getUsers);
router.put('/updatetPrime', auth, ctrlProfile.updateUserStatus);//


// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//task
router.post('/task', ctrlProfile.addTask);
router.get('/tasks', auth, ctrlProfile.getTask);
router.delete('/deletetask', auth, ctrlProfile.deleteTask);//updatetask
router.put('/updatetask', auth, ctrlProfile.updateTask);//
router.put('/updatetaskStatus', auth, ctrlProfile.updateTaskStatus);//

module.exports = router;
