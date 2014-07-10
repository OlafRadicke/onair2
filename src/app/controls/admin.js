
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
        var asteriskrequest = require('../lib/asteriskrequest.js');

        // read config
        try {
            config = JSON.parse(fs.readFileSync( configFile,'utf8'));
//             console.log("JSON.stringify(config): " + JSON.stringify(config));
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
            "asterisk_command": "ssh root@192.168.3.141 \"asterisk -vvvvvrx 'core show channels concise'\" | grep \"Up\" | grep -v \"None\" | cut -d'!' -f1 | cut -d'-' -f1",
            "browser_interval": "7",
            "mvv_interval": "60",
            "asterisk_interval": "10",
            "fortune_command": "fortune -s",
            "fortune_interval": "10"
        }
        config.asterisk_command = req.body.asterisk_command;
        config.browser_interval = req.body.browser_interval;
        config.cache_refresh = req.body.cache_refresh;
        config.fortune_command = req.body.fortune_command;

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
          config: config,
          aktivlines: asteriskrequest.getAktivLines()
        });
    }
};

module.exports = adminControllers;
