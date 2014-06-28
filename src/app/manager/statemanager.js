

function  StateManager(){

    var fs = require('fs');
    var allstates = {};
    var varData = __dirname + '/../../var/status.json';

    this.readStateConfig = function (){
        var stringState = fs.readFileSync( varData, 'utf8' );
        allstates = JSON.parse(stringState);
    }

    this.getAllStates = function (){
        return allstates;
    };
}

var statemanager = new StateManager( );
module.exports = statemanager;
