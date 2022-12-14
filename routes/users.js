var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController')
const {authenticateToken} = require('../middleware/auth')

/* GET home page. */
router.get('/', authenticateToken, userController.read);
router.get('/:id',authenticateToken, userController.readByid);
router.post('/signup',authenticateToken, userController.signup);
router.post('/signin',authenticateToken, userController.signin);
router.patch('/:id',authenticateToken, userController.update);
router.delete('/:id',authenticateToken, userController.destroy);


module.exports = router;
