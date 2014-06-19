
var express = require('express');
var app =  express();
var onair2 = new require('./app/onair2.js');


app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
// switch on newlines in Jade
app.locals.pretty = true;

app.use('/javascripts', express.static(__dirname + '/public/javascripts'));
app.use('/bootstrap', express.static(__dirname + '/public/bootstrap'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/stylesheets', express.static(__dirname + '/public/stylesheets'));

// ######### Routes ################
app.get( '/',  onair2.getStatus.bind(onair2) ) ;


app.listen(8080);
console.log('App started on port %d', 8080);



