const router = require('express').Router();
const {User} = require('../db');

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({where: {email: req.body.email}});
    if (!user){
      console.log('No such user found:', req.body.email);
      res.status(401).send('Wrong username and/or password');
    }else if (!user.confirmPwd(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email);
      res.status(401).send('Wrong username and/or password');
    }else{
      //password / session magic. (the session object is on the req)
      req.login(user, err => (err ? next(err) : res.json(user)));
    }
  } catch (error) {
    next(error);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    req.login(user, err => (err ? next(err) : res.json(user)));
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists');
    } else {
      next(err);
    }
  }
});

router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

//how will this be used and what is on the req.user object?
router.get('/me', (req, res) => {
  res.json(req.user);
});

module.exports = router;
