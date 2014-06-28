
var fs = require('fs');
var mvvinfo = require('./lib/mvvinfo.js');
var asteriskrequest = require('./lib/asteriskrequest.js');
var statemanager = require( './manager/statemanager.js');


function OnAir2( ) {

    var returnMinits = 99;

    this.getStatus  = function (req, res){

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
}




var onair2 = new OnAir2( );
module.exports = onair2;
