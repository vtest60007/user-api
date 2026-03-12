const router = require('express').Router();
const UserController = require('./controller');
const IsAuthenticated = require('../common/middlewares/IsAuthenticated');
const CheckPermission = require('../common/middlewares/CheckPermission');

// Admin-only: list all users
router.get('/', IsAuthenticated, CheckPermission('ADMIN'), UserController.getAllUsers);

// Authenticated: get user by ID
router.get('/:id', IsAuthenticated, UserController.getUserById);

// Authenticated: update user
router.patch('/:id', IsAuthenticated, UserController.updateUser);

// Admin-only: delete user
router.delete('/:id', IsAuthenticated, CheckPermission('ADMIN'), UserController.deleteUser);

// Admin-only: change user role
router.patch('/change-role/:id', IsAuthenticated, CheckPermission('ADMIN'), UserController.changeUserRole);

module.exports = router;
