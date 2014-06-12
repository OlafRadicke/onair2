
var express = require('express');
var app =  express();


app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
// switch on newlines in Jade
app.locals.pretty = true;

app.use('/js', express.static(__dirname + '/js'));


// Dummy data
var allrooms = ['Support', 'Vertrieb', 'Engineering'];
var allstate = [
  {
    "name": "Hugo",
    "room": "Support",
    "line": "ON AIR",
    "number": "155"
  },
  {
    "name": "Petra",
    "room": "Vertrieb",
    "line": "OFF AIR",
    "number": "166"
  },
  {
    "name": "Ingo",
    "room": "Support",
    "line": "OFF AIR",
    "number": "343"
  },
  {
    "name": "Thomas",
    "room": "Engineering",
    "line": "ON AIR",
    "number": "155"
  }
];

console.log(allstate);
console.log(allrooms);

// ######### Routes ################
app.get( '/',  function (req, res) {
    res.render('status', { allrooms: allrooms, allstate: allstate });
  }
)


app.listen(8080);
console.log('App started on port %d', 8080);



