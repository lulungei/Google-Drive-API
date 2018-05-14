
const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const hostname = '127.0.0.1'
const port = 3000;
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const readline = require('readline');
const {google} = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
const TOKEN_PATH = 'credentials.json';
// mongoose.connect('mongodb://driverUserAdmin:password@localhost:27017/drive');
mongoose.connect(config.database);
let db = mongoose.connection;

//check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

//Check for DB errors
db.on('error', function(err){
  console.log(err);
});

//Bring in models
let Detail = require('./models/details');

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Set Public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

//Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root   = namespace.shift()
    , formParam = root;

  while(namespace.length) {
    formParam += '[' + namespace.shift() +']';
  }
  return {
    param : formParam,
    msg   : msg,
    value : value
  };
  }
}));

//Passport Congig
require('./config/passport')(passport);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();

})

//Home route
app.get('/', function(req, res){
  Detail.find({}).populate('owner').exec(function(err, details){
    if(err){
      console.log(err);
    } else{
      res.render('index', {
        title: 'Folder Details',
        details: details
      });
    }
  });
});

// route Files

let details = require('./routes/details');
let users = require('./routes/users');
app.use('/details', details);
app.use('/users', users);

// start server
app.listen(3000, function(){
  console.log('Server started on port 3000...')
})
