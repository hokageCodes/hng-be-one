const express = require('express');
const router = express.Router();
const Controller = require('../controllers/helloController');

router.get('/hello', Controller.sayHello);

module.exports = router;
