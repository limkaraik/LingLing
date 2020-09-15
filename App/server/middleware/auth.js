const { User } = require('../models/User');

let auth = (req, res, next) => {
  let token = req.cookies.authToken;
  User.findByToken(token, (err, user) => {
    //check token matches the one in DB
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true,
      });
    req.user = user;
    next();
  });
};

module.exports = { auth };