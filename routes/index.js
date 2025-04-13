const router = require('express').Router();
const passport = require('passport');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.use('/project2', require('./project2'));
router.use('/houses', require('./houses'));

router.use('/', require('./swagger'));
router.get('/login', passport.authenticate('github'), (req, res) => { });

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/?message=You have been Logged out successfully');
  });
});


module.exports = router;