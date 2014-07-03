
var express = require('express');
var app =  express();
var onair2 = new require('./app/onair2.js');
var admin  = require('./app/controls/admin.js');
var asteriskrequest = require('./app/lib/asteriskrequest.js');
var mvvinfo = require('./app/lib/mvvinfo.js');
var fs = require('fs');
var statemanager = require('./app/manager/statemanager.js');

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
// switch on newlines in Jade
app.locals.pretty = true;

// path alias
app.use('/javascripts', express.static(__dirname + '/public/javascripts'));
app.use('/bootstrap', express.static(__dirname + '/public/bootstrap'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/stylesheets', express.static(__dirname + '/public/stylesheets'));

// ######### Routes ################
app.get( '/',  onair2.getStatus.bind(onair2) ) ;
app.get( '/admin',  admin.index ) ;
app.post( '/admin',  admin.updateStates );


// auto update asterisk infos about telephon activity.
asteriskrequest.updateList();
// Update all 10 sec.
setInterval( asteriskrequest.updateList, (1000 * 10) );

// auto update the mvv info all 60 sec.
mvvinfo.siteRequest();
setInterval( mvvinfo.siteRequest, (1000 * 60) );

// Is the configuration file change than do a reload.
statemanager.readStateConfig();
fs.watchFile('app/models/status.json', statemanager.readStateConfig );


app.listen(8080);
console.log( 'App started on port %d', 8080);



