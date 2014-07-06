
var execSync = require('exec-sync');

function AsteriskRequest(){
    var aktivLines = [];
//   var asterisk_command = "ssh root@192.168.3.141 \"asterisk -vvvvvrx 'core show channels concise'\" | grep \"Up\" | grep -v \"None\" | cut -d'!' -f1 | cut -d'-' -f1";
    var asterisk_command = "echo \"SIP/ingrid\nSIP/pascal\nSIP/1240\"";

    this.getAktivLines = function ()
    {
        return aktivLines;
    };

    this.update = function ()
    {
        var activ_lines = execSync(asterisk_command);
        this.aktivLines = activ_lines.split("\n");
    }
}
/*
if ( global.ASTERISK_REQUEST === null) {
    global.ASTERISK_REQUEST =  new AsteriskRequest();
    console.log("new AsteriskRequest()");
}*/
// global.ASTERISK_REQUEST = global.ASTERISK_REQUEST ? global.ASTERISK_REQUEST : new AsteriskRequest(); console.log("new AsteriskRequest()");
// module.exports = global.ASTERISK_REQUEST;

module.exports = new AsteriskRequest();
