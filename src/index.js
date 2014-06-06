
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('cookie-session')

var app =  express();

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

// Login middleware
app.use( bodyParser() );
app.use(session({
  keys: ['key1', 'key2']
}));

function checkAuth(req, res, next) {
  if(!req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
}

// Routes
app.get( '/',  function (req, res) {
    res.render('login');
  }
)

app.post('/login', function (req, res) {
  var user = req.body.username,
    pw = req.body.password;

  if ( user === 'u1' && pw === 'test' ) {
    req.session.user = 'u1';
  } else if ( user === 'u2' && pw === 'test' ) {
    req.session.user = 'u12';
  };

  res.redirect('/chat');
});

app.get( '/chat', checkAuth, function (req, res) {
  res.render('chat', {user: req.session.user});
});

app.get( '/logout', function (req, res) {
  delete req.session.user;
  res.redirect('/');

});

app.listen(8080);
