const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const server= require("https").createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
}, app);
const io = require('socket.io')(server);
require("dotenv").config();


const cookieparser = require('cookie-parser')

const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const cookieSession = require('cookie-session');

const { login , inside } = require("./controlers/login");
const { getrefral } = require('./controlers/getreferal')
const {joinroom} = require("./controlers/serverchat.io")
const PORT = 3000;

const config = {
  CLIENT_ID:process.env.CLIENT_ID,
  CLIENT_SECRET:process.env.CLIENT_SECRET,
   
};

const AUTH_OPTIONS = {
  callbackURL: '/auth/google/callback',
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

function verifyCallback(accessToken, refreshToken, profile, done) {
  done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

// Save the session to the cookie
passport.serializeUser((user, done) => {
  done(null, user);
});

// Read the session from the cookie
passport.deserializeUser((obj, done) => {
  // User.findById(id).then(user => {
  //   done(null, user);
  // });
  done(null, obj);
});



app.set('view engine','hbs');
app.set('views',path.join(__dirname,'views'));


app.use(cookieSession({
  name: 'session',
  maxAge: 24 * 60 * 60 * 1000,
  keys: [ "secret", "secret2" ],
}));
app.use(cookieparser([ "secret", "secret2" ]))
app.use(passport.initialize());
app.use(passport.session());

function checkLoggedIn(req, res, next) { 
  
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    return res.status(401).json({
      error: 'You must log in!',
    });
  }
  next();
}

app.get('/auth/google', 
  passport.authenticate('google', {
    scope: ['email'],
  }));

app.get('/auth/google/callback', 
  passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: '/inside',
    session: true,
  }), 
  (req, res) => {
    
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout(); //Removes req.user and clears any logged in session
  return res.redirect('/');
});

app.get('/getrefered', checkLoggedIn, getrefral);

app.get('/failure', (req, res) => {
  return res.send('Failed to log in!');
});

app.get('/', login);

app.get('/inside', inside);

server.listen(3000,()=>{
    console.log("listening")
})

joinroom(io);