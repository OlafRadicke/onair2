

function  StateManager(){

    var fs = require('fs');
    var allstates = {};

    this.readStateConfig = function (){
        var stringState = fs.readFileSync(__dirname + '/../models/status.json','utf8');
        allstates = JSON.parse(stringState);
    }

    this.getAllStates = function (){
        return allstates;
    };
}

var statemanager = new StateManager( );
module.exports = statemanager;
