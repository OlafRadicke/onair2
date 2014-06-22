
var fs = require('fs');
var adminControllers;

adminControllers = {
    'index': function (req, res) {
        //         var userData;
        //
        //         if (req.session && req.session.userData) {
        //             userData = JSON.stringify(req.session.userData);
        //         }
        //   var statusFile = __dirname + 'models/status.json';
        //   var stringStates = fs.readFileSync(statusFile,'utf8');
        var infotext = ""
        var stringStates = null;
        //   var stringStates = fs.readFileSync('models/status.json','utf8');
        var statusFile = __dirname + '/../models/status.json';
        console.log("statusFile: " + statusFile);


        try {
          console.log("statusFile: " + statusFile);
          stringStates = fs.readFileSync( statusFile,'utf8');
          console.log("stringStates: " + stringStates);
        } catch (e) {
          console.log("Can't read: " + statusFile);
        }

        res.render('admin', {
            jsonDB: stringStates,
            infoText: infotext
        });
    },
    'updateStates': function (req, res) {
        var infotext = "";
        var newStatus = req.body.newstatus;
        var statusFile = __dirname + '/../models/status.json';

        try {
            stringStates = fs.writeFileSync( statusFile, newStatus, 'utf8');
            infotext = "Gespeichert!";
        } catch (e) {
            console.log("Can't read: " + statusFile);
            infotext = "Konte nicht gespeichert werden!";
        }

        res.render('admin', {
          jsonDB: newStatus,
          infoText: infotext
        });
    }
};

module.exports = adminControllers;
