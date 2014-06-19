
var execSync = require('exec-sync');
var fs = require('fs');
var htmlparser = require("htmlparser");

function OnAir2( initTimeStamp ) {
  this.lastupdate = initTimeStamp;
  this.statusFile = __dirname + '/models/status.json';
  var stringState = fs.readFileSync(this.statusFile,'utf8');
  this.allstate = JSON.parse(stringState);
}

OnAir2.prototype.getTimeStamp = function () {
  return this.lastupdate
}

OnAir2.prototype.getStatus = function (req, res) {
//   var asterisk_command = "ssh root@192.168.3.141 \"asterisk -vvvvvrx 'core show channels concise'\" | grep \"Up\" | grep -v \"None\" | cut -d'!' -f1";
  // test
  var asterisk_command = "echo \"SIP/ingrid\nSIP/pascal\nSIP/1240\"";
  var now_checktime = new Date().getTime();

  if ( Math.round(( now_checktime - this.lastupdate) / 1000 ) > 60 ) {
    this.lastupdate = now_checktime;
    console.log("update timestamp...");
  } else {
    console.log("es sind noch nicht 60 Sek. vergangen: ");
    console.log( Math.round(( now_checktime - this.lastupdate) / 1000 ) );
  }
  console.log(this.lastupdate);
  console.log(now_checktime);

  var activ_lines = execSync(asterisk_command);
  console.log( "activ_lines:" + activ_lines);
  var activ_lines_list = activ_lines.split("\n");
  console.log("activ_lines_list: " + activ_lines_list);
  for(var roomIndex in this.allstate.room ) {
    for(var person in this.allstate.room[roomIndex] ) {
      for( var phonCode in activ_lines_list) {
        if( activ_lines_list[phonCode] === this.allstate.room[roomIndex][person].starfacecode ) {
          this.allstate.room[roomIndex][person].line = "ON AIR";
          break;
        } else {
          this.allstate.room[roomIndex][person].line = "OFF AIR";
        }
      }
    }
  }

//   console.log("JSON.stringify(this.allstate):" + JSON.stringify(this.allstate));
  res.render('status', {allstate: this.allstate} );
}


var onair2 = new OnAir2( new Date().getTime() );
module.exports = onair2;
