
var execSync = require('exec-sync');

function FortuneRequest(){
// var singleton = function singleton(){
    var fortuneCookie = "";
    var fortune_command = "fortune -s 'linux'";

    this.getCookie  = function (){
        return fortuneCookie;
    }

    this.updateFortune  = function ()
    {
        console.log("------- UPDATE Fortune ---------");
        fortuneCookie = execSync(fortune_command);
//         console.log("this.fortuneCookie: " + fortuneCookie);
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


module.exports = new FortuneRequest();

// global.fortunerequest = new FortuneRequest();

/* ************************************************************************
SINGLETON CLASS DEFINITION
************************************************************************ */
// singleton.instance = null;
// module.exports = singleton.getInstance();
