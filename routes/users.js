var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController')


/* GET home page. */
router.get('/', userController.read);
router.get('/:id', userController.readByid);
router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.patch('/:id', userController.update);
router.delete('/:id', userController.destroy);


module.exports = router;
