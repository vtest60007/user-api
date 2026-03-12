const router = require('express').Router();
const AuthController = require('./controller');

// Signup
router.post('/signup', AuthController.register);

// Login
router.post('/login', AuthController.login);

module.exports = router;
