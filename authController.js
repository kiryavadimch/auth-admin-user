const User = require('./models/User');
const Admin = require('./models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('./config/config');

const generateAcessToken = (id) => {
   const payload = {id}
   return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class authController {
   async userRegister(req, res) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res
               .status(400)
               .json({ message: 'Validation error', errors });
         }

         const { username, password } = req.body;
         const candidate = await User.findOne({ username });
         if (candidate) {
            return res.status(400).json({
               message:
                  'User with current name is already exist. Please change the name and try again.',
            });
         }

         const salt = bcrypt.genSaltSync(10);
         const hashedPassword = bcrypt.hashSync(password, salt);

         const user = new User({
            username,
            password: hashedPassword,
         });
         await user.save();

         return res
            .status(200)
            .json({ message: 'User created comletely: ', user });
      } catch (e) {
         console.log(e);
         res.status(400).json({ message: 'registration error' });
      }
   }

   async adminRegister(req, res) {
      try {
         if (req.headers['secretkey'] != '12345') {
            return res
               .status(400)
               .json({ message: 'Invalid secret key', errors });
         }
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res
               .status(400)
               .json({ message: 'Validation error', errors });
         }

         const { username, password } = req.body;
         const candidate = await Admin.findOne({ username });
         if (candidate) {
            return res.status(400).json({
               message:
                  'User with current name is already exist. Please change the name and try again.',
            });
         }

         const salt = bcrypt.genSaltSync(10);
         const hashedPassword = bcrypt.hashSync(password, salt);

         const admin = new Admin({
            username,
            password: hashedPassword,
         });
         await admin.save();

         return res
            .status(200)
            .json({ message: 'User created comletely: ', admin });
      } catch (e) {
         console.log(e);
         res.status(400).json({ message: 'registration error' });
      }
   }

   async login(req, res) {
      try {
         const { username, password } = req.body;
         let user = await User.findOne({ username });
         if (!user) {
            user = await Admin.findOne({ username });
            if (!user) {
               res.status(400).json({ message: `User ${username} not found` });
            }
         }
         console.log(user);

         const validPassword = bcrypt.compareSync(password, user.password);
         if (!validPassword) {
            res.status(400).json({ message: 'Wrong password!' });
         }
         const token = generateAcessToken(user._id);
         return res.status(200).json({ token: token });
      } catch (e) {
         console.log(e);
         res.status(400).json({ message: 'login error' });
      }
   }

   async getUsers(req, res) {
      try {
         const users = await User.find({}).select('username')

         res.status(200).json({ users: users });
      } catch (e) {
         console.log(e);
         res.status(400).json({ message: e });
      }
   }
   async whoami(req, res){
      try {
         let user = req.user
         res.status(200).json({user})
      } catch (e) {
         console.log(e);
         res.status(400).json({ message: e });
      }
   }
}

module.exports = new authController();
