const express = require('express');
const router = express.Router();
const Controller = require('../Controller/userController');
const IsAuth = require('../Controller/isAuth');

router.post('/signup', Controller.signupController);
router.post('/login', Controller.loginController);
router.get('/verify-token', IsAuth, (req, res) => {
  res.status(200).json({ message: 'Token is valid', user: req.user });
});

module.exports = router;

