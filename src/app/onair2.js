
var exec = require('child_process').exec;
var fs = require('fs');

//  execute commands
function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};



function OnAir2( initTimeStamp ) {
  this.lastupdate = initTimeStamp;
  this.statusFile = __dirname + '/models/status.json';

  fs.readFile(this.statusFile, 'utf8', function (err, allstate) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }

    this.allstate = JSON.parse(allstate);

    console.dir("this.allstate:");
    console.dir(this.allstate);
    console.dir("this.allstate.room['Consulting'][1].name:");
    console.dir(this.allstate.room["Consulting"][1].name);
  });

}




OnAir2.prototype.getTimeStamp  = function () {
  return this.lastupdate
}

OnAir2.prototype.getStatus = function (req, res) {
//   var asterisk_command = "ssh root@192.168.3.141 \"asterisk -vvvvvrx 'core show channels concise'\" | grep \"Up\" | grep -v \"None\" | cut -d'!' -f1";
  // test
  var asterisk_command = "echo \"SIP/ingrid\nSIP/pascal\nSIP/1240\"";

  var now_checktime = new Date().getTime();
  console.log("[001] check time stamps:");
  console.log(this.lastupdate);
  console.log(now_checktime);
  if ( Math.round(( now_checktime - this.lastupdate) / 1000 ) > 60 ) {
    this.lastupdate = now_checktime;
    console.log("update timestamp...");
  } else {
    console.log("es sind noch nicht 60 Sek. vergangen: ");
    console.log( Math.round(( now_checktime - this.lastupdate) / 1000 ) );
  }
  console.log(this.lastupdate);
  console.log(now_checktime);


  execute(asterisk_command, function(activ_lines){
      console.log( activ_lines );
      var activ_lines_list = activ_lines.split("\n");
      for (index = 0; index < activ_lines_list.length; ++index) {
//         for (index2 = 0; index2 < this.allstate.room.length; ++index2) {
        for(var room in this.allstate.room ) {
          for(var person in room ) {
             if (activ_lines_list[index] === person.starfacecode) {
               person.line = "ON AIR";
             } else {
               person.line = "OFF AIR";
             }
          }
        }
      }
  });

  res.render('status', { allstate: this.allstate });
}


var onair2 = new OnAir2( new Date().getTime() );
console.log("check time stamp member:");
console.log(onair2.getTimeStamp());
module.exports = onair2;
