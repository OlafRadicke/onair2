
var fs = require('fs');
var adminControllers;

adminControllers = {
    'index': function (req, res) {
        "use strict";
        var infotext = ""
        var stringStates = null;
        var config = null;
        var statusFile = __dirname + '/../../var/status.json';
        var configFile = __dirname + '/../../var/config.json';
        // read config
        try {
            config = JSON.parse(fs.readFileSync( configFile,'utf8'));
            console.log("JSON.stringify(config): " + JSON.stringify(config));
        } catch (e) {
            console.log("Can't read: " + configFile);
            infotext = "Can't read: " + configFile;
        }
        // read status
        try {
            var stringStates = fs.readFileSync( statusFile, 'utf8' );
        } catch (e) {
            console.log("Can't read: " + statusFile + "\n" + e);
            infotext = infotext + " Can't read: " + statusFile;
        }

        res.render('admin', {
            jsonDB: stringStates,
            infoText: infotext,
            config: config
        });
    },
    'updateStates': function (req, res) {
        "use strict";
        var infotext = "";
        var statusFile = __dirname + '/../../var/status.json';
        var configFile = __dirname + '/../../var/config.json';
        var newStatus = req.body.newstatus;
        var config = {
            "asterisk_command": "",
            "browser_interval": "",
            "mvv_interval": "",
            "asterisk_interval": ""
        }
        config.asterisk_command = req.body.asterisk_command;
        config.browser_interval = req.body.browser_interval;
        config.mvv_interval = req.body.mvv_interval;
        config.asterisk_interval = req.body.asterisk_interval;

        // write status
        try {
            fs.writeFileSync( statusFile, newStatus, 'utf8');
            infotext = "...Gespeichert!";
        } catch (e) {
            infotext = statusFile + "konte nicht gespeichert werden! ";
        }

        // wite config...
        try {
            fs.writeFileSync( configFile, JSON.stringify(config), 'utf8');
            infotext = "...Gespeichert!";
        } catch (e) {
            infotext = configFile + "konte nicht gespeichert werden! " + infotext;
        }

        res.render('admin', {
          jsonDB: newStatus,
          infoText: infotext,
          config: config
        });
    }
};

module.exports = adminControllers;
