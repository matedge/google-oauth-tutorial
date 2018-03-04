const router = require('express').Router();
const passport = require('passport')

// 1. auth login
router.get('/login', (req, res) => {
  res.render('login');
});

// 3. auth logout
router.get('/logout', (req, res) => {
  // -> handle with Passport.js
  res.send('logging out')
});

// 2. auth with Google 
// use passport.authenticate instead of (req, res) => { } in the second param of router.get 
router.get('/google', passport.authenticate('google', {
  scope: ['profile'] // if you want other info, add ',' and the objects
}));

// 4. callback route for Google to redirect to 
// passport.authenticate('google') is used here to retrieve the code from Google and use it so that we can exchange profile information from Google back to our server
// the Passport callback function in passport-setup.js is fired once we receieve the code from Google from the above note
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.send('you reached the callback URI')
})
module.exports = router;
