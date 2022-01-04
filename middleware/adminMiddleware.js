const Admin = require('../models/Admin')
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
      admin = await Admin.findOne({_id:id}).select('password').exec()
      if (!admin) {
         return res
            .status(403)
            .json({ message: 'User does not have sufficient permissions' });
      }
      req.user = admin
      next();
   } catch (e) {
      console.log(e);
      res.status(403).json({ message: 'err' });
   }
};
