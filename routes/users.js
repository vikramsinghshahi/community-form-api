var express = require('express');
var router = express.Router();
var User = require('../models/User');
var auth = require('../middlewares/auth');

/* GET users listing. */

router.get('/', auth.verifyToken, async function (req, res, next) {
  try {
    var users = await User.find({});
    res.status(200).json({ users: users });
  } catch (error) {
    return next(error);
  }
});

// registration handler

router.post('/register', async (req, res, next) => {
  let data = req.body;
  try {
    var user = await User.findOne({ email: data.email });
    if (user) {
      return res.json({ error: 'user exist try login' });
    }
    if (!user) {
      let createdUser = await User.create(data);
     // console.log(createdUser)
      res.json({ name: createdUser.name, message: 'registered successfully' });
    }
  } catch (error) {
    next(error);
  }
});

// login handler

router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.sendStatus(400).json({ error: 'Email/Password required' });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'This email is not registered' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: 'Invalid Password' });
    }
    // generate token
    var token = await user.signToken();
    res.json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

//authorization of the routes using this verify token middleware

router.use(auth.verifyToken);

//Get current user Data

router.get('/currentUserData', async (req, res, next) => {
  let payload = req.user;
  let token = req.headers.authorization;
  console.log(token)
  try {
    let user = await User.findOne({ username: payload.username });
    res.json({ user: await user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

//Follow user

router.get('/follow/:id', async (req, res, next) => {
  let userId = req.params.id;
  let loggedprofile = req.user;
  console.log(loggedprofile)
  try {
    let loggedUser = await User.findOne({ username: loggedprofile.username });
    console.log(loggedUser.following.includes(userId));
    if (userId === loggedUser.id) {
      return res.status(400).json({ error: 'User cant follow himself' });
    } else if (loggedUser.following.includes(userId)) {
      return res
        .status(400)
        .json({ error: 'User cannot follow same person twice' });
    } else {
      let updatedTargetUser = await User.findByIdAndUpdate(userId, {
        $push: { followers: loggedUser.id },
      });

      let updatedUser = await User.findByIdAndUpdate(loggedUser.id, {
        $push: { following: userId },
      });

      return res.json({ updatedUser, updatedTargetUser });
    }
  } catch (error) {
    next(error);
  }
});

//Unfollow User

router.get('/unfollow/:id', async (req, res, next) => {
  let userId = req.params.id;
  let loggedprofile = req.user;
  try {
    let loggedUser = await User.findOne({ username: loggedprofile.username });

    if (userId === loggedUser.id) {
      return res.status(400).json({ error: 'You cannot unfollow yourself' });
    } else if (!loggedUser.following.includes(userId)) {
      return res
        .status(400)
        .json({ error: 'You can not follow same person twice' });
    } else {
      let updatedTargetUser = await User.findByIdAndUpdate(userId, {
        $pull: { followers: loggedUser.id },
      });

      let updatedUser = await User.findByIdAndUpdate(loggedUser.id, {
        $pull: { following: userId },
      });

      return res.json({ updatedUser, updatedTargetUser });
    }
  } catch (error) {
    next(error);
  }
});

//Block User by Administrator

router.get('/block/:name', async (req, res, next) => {
  let username = req.params.name;

  try {
    let updateduser = await User.findOneAndUpdate(
      { username },
      { isBlocked: true }
    );

    let updatedProfile = await Profile.findOneAndUpdate(
      { username },
      { isBlocked: true }
    );

    return res.json({ updatedProfile });
  } catch (error) {
    next(error);
  }
});

//Unblock user by Administrator

router.get('/unblock/:name', async (req, res, next) => {
  let username = req.params.name;

  try {
    let updateduser = await User.findOneAndUpdate(
      { username },
      { isBlocked: false }
    );

    let updatedProfile = await Profile.findOneAndUpdate(
      { username },
      { isBlocked: false }
    );

    return res.json({ updatedProfile });
  } catch (error) {
    next(error);
  }
});

module.exports = router;