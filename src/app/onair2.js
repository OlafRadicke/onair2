
var fs = require('fs');
var mvvinfo = require('./lib/mvvinfo.js');
var asteriskrequest = require('./lib/asteriskrequest.js');
var statemanager = require( './manager/statemanager.js');
var returnMinits = 99;

function OnAir2( initTimeStamp ) {
//   this.lastupdate = initTimeStamp;
//   this.statusFile = __dirname + '/models/status.json';
//   var stringState = fs.readFileSync(this.statusFile,'utf8');
//   this.allstate = JSON.parse(stringState);
//
//   this.getTimeStamp = function () {
//     return this.lastupdate
//   };

}

OnAir2.prototype.getStatus = function (req, res) {
//     var now_checktime = new Date().getTime();
//     now_checktime = now_checktime + 1000 * 61
//     var timeOut = 90;

//     if ( Math.round(( now_checktime - this.lastupdate) / 1000 ) > timeOut ) {
//         this.statusFile = __dirname + '/models/status.json';
//         var stringState = fs.readFileSync(this.statusFile,'utf8');
//         this.allstate = JSON.parse(stringState);
//         this.lastupdate = now_checktime;
//     } else {
//         console.log("es sind noch nicht " + timeOut + " Sek. vergangen: ");
//         console.log( Math.round(( now_checktime - this.lastupdate) / 1000 ) );
//         console.log( "Benutze Benutzerdaten aus dem cach" );
//     }

    var allstates = statemanager.getAllStates();
    for(var roomIndex in allstates.room ) {
        for(var person in allstates.room[roomIndex] ) {
            for( var phonCode in asteriskrequest.aktivLines) {
                if( asteriskrequest.aktivLines[phonCode] === allstates.room[roomIndex][person].starfacecode ) {
                    allstates.room[roomIndex][person].line = "ON AIR";
                    break;
                } else {
                    allstates.room[roomIndex][person].line = "OFF AIR";
                }
            }
        }
    }

    console.log( "JSON.stringify(allstates): " + JSON.stringify(allstates));
    // ########## train info #######################
    returnMinits = mvvinfo.getNextTrain();

    // Render HTML
    res.render('status', {allstate: allstates, nexttrain: returnMinits } );
}


var onair2 = new OnAir2( new Date().getTime() );
module.exports = onair2;
