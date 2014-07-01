
var execSync = require('exec-sync');

function AsteriskRequest(){
    this.aktivLines = [];
//   var asterisk_command = "ssh root@192.168.3.141 \"asterisk -vvvvvrx 'core show channels concise'\" | grep \"Up\" | grep -v \"None\" | cut -d'!' -f1 | cut -d'-' -f1";
    var asterisk_command = "echo \"SIP/ingrid\nSIP/pascal\nSIP/1240\"";

    this.updateList  = function ()
    {
        var activ_lines = execSync(asterisk_command);
        this.aktivLines = activ_lines.split("\n");
    }
}



var asteriskrequest = new AsteriskRequest( );
module.exports = asteriskrequest;
