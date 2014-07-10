
var fs = require('fs');

function ConfigManager(){

    var configFile = __dirname + '/../../var/config.json';
    var config = null;

    this.getConfig  = function (){
        if ( config == null ) {
            this.loadConfig();
        }
        return config;
    }

    this.loadConfig  = function ()
    {
        // read config
        try {
            config = JSON.parse(fs.readFileSync( configFile,'utf8'));
            console.log("------- READ CONFIG ---------");
            console.log("JSON.stringify(config): " + JSON.stringify(config));
        } catch (e) {
            console.log("Can't read: " + configFile + "\n ERROR: " + e );
            infotext = "Can't read: " + configFile;
        }
    };

    this.writeConfig  = function ( newConfig )
    {
        config = newConfig;
        // wite config...
        try {
            fs.writeFileSync( configFile, JSON.stringify(config), 'utf8');
            infotext = "...Gespeichert!";
        } catch (e) {
            infotext = configFile + "konte nicht gespeichert werden! " + infotext;
        }
    };

//     this.instance = null;
    /**
     * Singleton getInstance definition
     * @return singleton class
     */
//     this.getInstance = function(){
//         if(this.instance === null){
//             this.instance = new singleton();
//             console.log("======================= NEW INSTANCE ===================");
//         }
//         return this.instance;
//         console.log("======================= GET OLD INSTANCE ===================");
//     }

}

// Assure the FortuneRequest object is a singleton.
// global.FORTUNE_REQUEST = global.FORTUNE_REQUEST ? global.FORTUNE_REQUEST : new FortuneRequest();
// The module exports a singleton instance of the FortuneRequest class so the
// instance is immediately available on require(), and the prototype methods
// aren't a part of the object namespace when inspected.
// module.exports = global.FORTUNE_REQUEST;


module.exports = new ConfigManager();

// global.fortunerequest = new FortuneRequest();

/* ************************************************************************
SINGLETON CLASS DEFINITION
************************************************************************ */
// singleton.instance = null;
// module.exports = singleton.getInstance();
