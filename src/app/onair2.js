
var exec = require('child_process').exec;

//  execute commands
function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};



function OnAir2( initTimeStamp ) {
  this.lastupdate = initTimeStamp;
  console.log("init classe with time stamp:");
  console.log(this.lastupdate);

// Dummy data
  this.allrooms = ['Besprechungsraum', 'Consulting', 'Vertrieb', 'Engineering', 'Support'];
  this.allstate = [
    {
      "name": "Unbekannt",
      "starfacecode": "besprechungsraum",
      "room": "Besprechungsraum",
      "line": "ON AIR",
      "number": ""
    },
    {
      "name": "Michael",
      "starfacecode": "SIP/1051.tiptel286",
      "room": "Consulting",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "Peter",
      "starfacecode": "SIP/peter",
      "room": "Consulting",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "Patrick",
      "starfacecode": "SIP/nina",
      "room": "Consulting",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "Mark",
      "starfacecode": "SIP/Gigaset3",
      "room": "Consulting",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "Klaas",
      "starfacecode": "SIP/1241",
      "room": "Consulting",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "Dominic",
      "starfacecode": "SIP/ducpham",
      "room": "Consulting",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "Holger",
      "starfacecode": "SIP/neubauer",
      "room": "Engineering",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "Florian",
      "starfacecode": "SIP/1050.tiptel286",
      "room": "Engineering",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "Philipp",
      "starfacecode": "SIP/philipp",
      "room": "Engineering",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "Thomas",
      "starfacecode": "SIP/1240",
      "room": "Support",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "Olaf",
      "starfacecode": "SIP/olaf",
      "room": "Support",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "Pascal",
      "starfacecode": "SIP/pascal",
      "room": "Support",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "Tobias",
      "starfacecode": "SIP/tobias",
      "room": "Support",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "Jan",
      "starfacecode": "SIP/Gigaset4",
      "room": "Vertrieb",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "",
      "starfacecode": "",
      "room": "Vertrieb",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "Ingrid",
      "starfacecode": "SIP/ingrid",
      "room": "Vertrieb",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "Julie",
      "starfacecode": "SIP/julian",
      "room": "Vertrieb",
      "line": "OFF AIR",
      "number": ""
    },
    {
      "name": "Stefan",
      "starfacecode": "SIP/stefan",
      "room": "Vertrieb",
      "line": "OFF AIR",
      "number": ""
    }
  ];
}


OnAir2.prototype.getTimeStamp  = function () {
  return this.lastupdate
}

OnAir2.prototype.getStatus = function (req, res) {
  "use strict";
  var asterisk_command = "ssh root@192.168.3.141 \"asterisk -vvvvvrx 'core show channels concise'\" | grep \"Up\" | grep -v \"None\" | cut -d'!' -f1";

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
        for (index2 = 0; index2 < this.allrooms.length; ++index2) {
           if (activ_lines_list[index] === this.allrooms[index2].starfacecode) {
             this.allrooms[index2].line = "ON AIR";
           } else {
             this.allrooms[index2].line = "OFF AIR";
           }
        }
      }
  });

  res.render('status', { allrooms: this.allrooms, allstate: this.allrooms });
}


var onair2 = new OnAir2( new Date().getTime() );
console.log("check time stamp member:");
console.log(onair2.getTimeStamp());
module.exports = onair2;
