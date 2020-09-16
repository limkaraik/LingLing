const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const {User} = require('../models/User');
const {auth} = require('../middleware/auth')


router.get('/auth', auth, (req, res) => {
    res.status(200).json({
      _id: req.user._id,
      success: true,
      email: req.user.email,
      name: req.user.name,
    });
});

router.post('/register', async (req, res) => {
    //hashing password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    const user = new User(req.body);
    //save to mongoDB
    try {
      await user.save();
      res.status(200).json({ success: true });
    } catch (err) {
      res.json({success: false});
    }
  });

router.post('/login', async (req, res) => {
    //check if email exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.json({
        success: false,
        message: 'Email is not found',
        });
    }
    //check for valid password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        return res.json({
        success: false,
        message: 'Password is incorrect',
        });
    }

    //generate authentication token
    await user.generateToken((err, user) => {
        //create and store token in DB
        if (err) return res.status(400).send(err);
        res
        .cookie('authToken', user.token, {
            //store token as cookie
            expires: new Date(Date.now() + 32 * 3600000), // cookie will be removed after 32 hours
            httpOnly: true,
            sameSite: true
        })
        .status(200)
        .json({ success: true, userId: user._id });
    });
});

router.get('/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
        success: true,
        });
    });
});

module.exports = router;