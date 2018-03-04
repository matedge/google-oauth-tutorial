const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys')

passport.use(
  new GoogleStrategy({
    // options for google strategy
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/auth/google/redirect'
  }, (accessToken, refreshToken, profile, done) => {
    // Passport callback function with the actual information about the 'profile' comes back
    console.log(profile)
  })
);