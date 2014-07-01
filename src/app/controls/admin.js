
var fs = require('fs');
var adminControllers;

adminControllers = {
    'index': function (req, res) {
        var infotext = ""
        var stringStates = null;
        var statusFile = __dirname + '/../../var/status.json';
        try {
          stringStates = fs.readFileSync( statusFile,'utf8');
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
        var statusFile = __dirname + '/../../var/status.json';

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
