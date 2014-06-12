
var express = require('express');
var app =  express();
var exec = require('child_process').exec;


app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
// switch on newlines in Jade
app.locals.pretty = true;

app.use('/js', express.static(__dirname + '/js'));

//  execute commands
function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};


// Dummy data
var allrooms = ['Support', 'Vertrieb', 'Engineering'];
var allstate = [
  {
    "name": "Hugo",
    "starfacecode": "54334",
    "room": "Support",
    "line": "ON AIR",
    "number": "155"
  },
  {
    "name": "Petra",
    "starfacecode": "54334",
    "room": "Vertrieb",
    "line": "OFF AIR",
    "number": "166"
  },
  {
    "name": "Ingo",
    "starfacecode": "54334",
    "room": "Support",
    "line": "OFF AIR",
    "number": "343"
  },
  {
    "name": "Thomas",
    "starfacecode": "54334",
    "room": "Engineering",
    "line": "ON AIR",
    "number": "155"
  }
];
var lastupdate = new Date().getTime();


// console.log(allstate);
// console.log(allrooms);
console.log(lastupdate);

// ######### Routes ################
app.get( '/',  function (req, res) {
  var asterisk_command = "ssh root@192.168.3.141 \"asterisk -vvvvvrx 'core show channels concise'\" | grep \"Up\" | grep -v \"None\" | cut -d'!' -f1";

  execute(asterisk_command, function(activ_lines){
      console.log( activ_lines );
      console.log(lastupdate);
      var activ_lines_list = activ_lines.split("\n");
      for (index = 0; index < activ_lines_list.length; ++index) {
        for (index2 = 0; index2 < allstate.length; ++index2) {
           if (activ_lines_list[index] === allstate[index2].starfacecode) {
             allstate[index2].line = "ON AIR";
           } else {
             allstate[index2].line = "OFF AIR";
           }
        }
      }
  });

    res.render('status', { allrooms: allrooms, allstate: allstate });
  }
)


app.listen(8080);
console.log('App started on port %d', 8080);



