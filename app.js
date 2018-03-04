const express = require('express')
const authRoutes = require('./routes/auth-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys')

const app = express();

// 1. set up view engine
app.set('view engine', 'ejs');

// 5. connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
  console.log('connected to mongodb');
});

// 4. set up routes
app.use('/auth', authRoutes);

// 2. create home route
app.get('/', (req, res) => {
  res.render('home');
});

app.listen(3000, () => {
  console.log("app now listening for requestion on port 3000")
});

