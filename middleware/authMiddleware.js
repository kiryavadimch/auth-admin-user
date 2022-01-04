const User = require('../models/User')
const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');

module.exports = async function (req, res, next) {
   if (req.method === 'OPTIONS') {
      next();
   }

   try {
      token = req.headers.authorization.split(' ')[1];
      if (!token) {
         res.status(403).json({ message: 'User is not logged in' });
      }

      const {id:id} = jwt.verify(token, secret);
      user = await User.findOne({_id:id}).select('username').exec()
      if (!user) {
         return res
            .status(403)
            .json({ message: 'User does not have sufficient permissions' });
      }
      req.user = user
      next();
   } catch (e) {
      console.log(e);
      res.status(403).json({ message: 'User is not logged in' });
   }
};
