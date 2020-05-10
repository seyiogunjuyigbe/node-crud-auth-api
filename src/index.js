const express = require('express');
const app = express();
const {PORT,SECRET} = require('./config/constants')
const {startDb} = require('./database/db');
const bodyParser = require('body-parser');
const User = require('./models/user');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const passportLocalMongoose = require('passport-local-mongoose')
startDb();
const initRoutes = require('./routes/routes')
app.use(cors());
app.set('views', path.join(__dirname, 'views')) // Redirect to the views directory inside the src directory
app.use(express.static(path.join(__dirname, '../public'))); // load local css and js files
app.set('view engine', 'ejs');
app.use(express.json());
app.use(require("express-session")({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  expires: new Date(Date.now() + (30 * 80000 * 1000)),
  cookie:{
      maxAge: 30 * 80000 * 1000
  }
})
);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
app.use(passport.initialize());
app.use(passport.session())
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use("local", new LocalStrategy(User.authenticate()));

initRoutes(app)
var port = PORT || process.env.PORT || 3000
app.listen(port, ()=>console.log('Server listening on '+ port))