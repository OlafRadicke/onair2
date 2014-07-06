
 "use strict"

function OnAir2( app ) {
    var reqCount = 0;
    var fs = require('fs');
    var fortunerequest = require('./lib/fortunerequest.js');
    var asteriskrequest = require('./lib/asteriskrequest.js');
    var mvvinfo = require('./lib/mvvinfo.js');
    var statemanager = require( './manager/statemanager.js');
    var returnMinits = 99;

    this.readStateConfig = function (req, res){
        statemanager.readStateConfig();
    }

    this.initInstance = function (req, res){
        // fortunerequest
        fortunerequest.updateFortune();
        setInterval( fortunerequest.updateFortune, (1000 * 10) );

        // asteriskrequest
        asteriskrequest.update();
        // Update all 10 sec.
        setInterval( asteriskrequest.update, (1000 * 10) );

        // MVV-Check
        mvvinfo.siteRequest();
        // Update all 10 sec.
        setInterval( mvvinfo.siteRequest, (1000 * 10) );

        // Is the configuration file change than do a reload.
        statemanager.readStateConfig();
        fs.watchFile('models/status.json', statemanager.readStateConfig );
    };

    this.getStatus  = function (req, res){
        statemanager.readStateConfig()
        var cookieText = "";
        var allstates = statemanager.getAllStates();
        for(var roomIndex in allstates.room ) {
            for(var person in allstates.room[roomIndex] ) {
                for( var phonCode in asteriskrequest.getAktivLines()) {
                    if( asteriskrequest.getAktivLines()[phonCode] === allstates.room[roomIndex][person].starfacecode ) {
                        allstates.room[roomIndex][person].line = "ON AIR";
                        break;
                    } else {
                        allstates.room[roomIndex][person].line = "OFF AIR";
                    }
                }
            }
        }
        // ########## train info #######################
        returnMinits = mvvinfo.getNextTrain();
        console.log("returnMinits: " + returnMinits);
        cookieText = fortunerequest.getCookie();
//         console.log("================================================");
//         console.log("------------------------------------------------");
//         console.log("onair2->global.fortunerequest.fortuneCookie: \n" + cookieText);
//         console.log("------------------------------------------------");
//         console.log("================================================");

        // Render HTML
        res.render
        (
            'status',
            {
                allstate: allstates,
                nexttrain: returnMinits,
                fortuneCookie: cookieText
            }
        );
    }
}

var onair2 = new OnAir2( );
module.exports = onair2;
