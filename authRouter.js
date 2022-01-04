const Router = require('express');
const router = new Router();
const controller = require('./authController');
const { check } = require('express-validator');
const authMiddleware = require('./middleware/authMiddleware')
const adminMiddleware = require('./middleware/adminMiddleware');

router.post(
   '/userRegister',
   [
      check('username', 'Empty user name!').notEmpty(),
      check('password', 'Password must be longer than 7 and less than 312').isLength({min:8, max: 312}),
   ],
   controller.userRegister
);
router.post(
   '/adminRegister',
   [
      check('username', 'Empty user name!').notEmpty(),
      check('password', 'Password must be longer than 7 and less than 312').isLength({min:8, max: 312}),
   ],
   controller.adminRegister
);
router.post('/login', controller.login);
router.get('/users', adminMiddleware, controller.getUsers);
router.get('/whoami',authMiddleware || adminMiddleware , controller.whoami)

module.exports = router;
