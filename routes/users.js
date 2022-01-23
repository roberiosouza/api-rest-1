const express = require('express');
const router = express.Router();

const userController = require('../controllers/user-controller');

router.post('/created', userController.postCreated);

router.post('/login', userController.postLogin);

module.exports = router;