
var execSync = require('exec-sync');
var fs = require('fs');
var htmlparser = require("htmlparser");
var http = require('http');
var returnMinits = 99;

function OnAir2( initTimeStamp ) {
  this.lastupdate = initTimeStamp;
  this.statusFile = __dirname + '/models/status.json';
  var stringState = fs.readFileSync(this.statusFile,'utf8');
  this.allstate = JSON.parse(stringState);

  this.getTimeStamp = function () {
    return this.lastupdate
  };
}


OnAir2.prototype.getParsedTime = function (rawHtml) {
//   console.log('BODY: ' + rawHtml);
  var minuts = null;
  var anyRow = null;
  var statonName = null;
  var handler = new htmlparser.DefaultHandler(function(err, dom) {
    if (err) {
      sys.debug("Error: " + err);
    } else {
      var rowEven = htmlparser.DomUtils.getElements({ tag_name: "tr", class: "rowEven" }, dom);
      var rowOdd = htmlparser.DomUtils.getElements({ tag_name: "tr", class: "rowOdd" }, dom);
      var rowAll = rowOdd.concat( rowEven );
      console.log("--->rowAll.length: " + rowAll.length );
      returnMinits = 999;
      for (var i = 0; i < rowAll.length; i++) {
        console.log("---> Round: " + i);
        console.log("---> JSON.stringify(rowAll[i]): " + JSON.stringify(rowAll[i]));
//         console.log("---> rowOdd: " + JSON.stringify(rowOdd) );

        try{
            statonName = rowAll[i]["children"][3]["children"][0]["data"];
        } catch (e) {
            console.log("Error: " + e);
            continue;
        }
        statonName = statonName.replace(/\t/g, '').replace(/\n/g, '').trim()
        console.log("--->statonName: " );
        console.log( statonName );
        if ( statonName.search("Ostbahnhof") > -1 || statonName.search("Hbf") > -1 ) {
            console.log( "### INNENSTADT ###" );
            try{
                minuts = rowAll[0]["children"][5]["children"][0]["data"];
            } catch (e) {
                console.log("Error: " + e);
                continue;
            }
            console.log("---> minuten: " );
            console.log( minuts );
            minuts = minuts - 7;
            console.log( "### UMGERECHNET ###" );
            console.log( "minuts: " + minuts );
            console.log(  "returnMinits: " + returnMinits );
            if ( minuts > 0 && minuts < returnMinits ) {
              console.log( "### SPEICHERE ###" );
              console.log( "minuts: " + minuts );
              returnMinits  = minuts;
              console.log( "returnMinits: " + returnMinits );
            }
        }
      }
    }
  }, { verbose: false });
  var parser = new htmlparser.Parser(handler);
  parser.parseComplete(rawHtml);
}

OnAir2.prototype.getNextTrain  = function () {
  // ########## train info #######################
  var minuts = null;
  var options = {
    host: 'www.mvg-live.de',
    port: 80,
    path: '/ims/dfiStaticAuswahl.svc?haltestelle=Feldmoching+Bf.&sbahn=checkedm'
  };

  http.get(options, function(res) {
//     console.log("Got response: " + res.statusCode);
    res.on(
      'data',
      function (rawHtml) {
        OnAir2.prototype.getParsedTime(rawHtml);
//         this.getParsedTime(rawHtml);
      }
    );

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}

OnAir2.prototype.getStatus = function (req, res) {
//   var asterisk_command = "ssh root@192.168.3.141 \"asterisk -vvvvvrx 'core show channels concise'\" | grep \"Up\" | grep -v \"None\" | cut -d'!' -f1 | cut -d'-' -f1";
  // test
  var asterisk_command = "echo \"SIP/ingrid\nSIP/pascal\nSIP/1240\"";
  var now_checktime = new Date().getTime();
  now_checktime = now_checktime + 1000 * 61
  var timeOut = 10;


  if ( Math.round(( now_checktime - this.lastupdate) / 1000 ) > timeOut ) {
      this.statusFile = __dirname + '/models/status.json';
      var stringState = fs.readFileSync(this.statusFile,'utf8');
      this.allstate = JSON.parse(stringState);
  }


  if ( Math.round(( now_checktime - this.lastupdate) / 1000 ) > timeOut ) {
    var activ_lines = execSync(asterisk_command);
    console.log( "activ_lines:" + activ_lines);
    var activ_lines_list = activ_lines.split("\n");
    console.log("activ_lines_list: " + activ_lines_list);
    for(var roomIndex in this.allstate.room ) {
      for(var person in this.allstate.room[roomIndex] ) {
        for( var phonCode in activ_lines_list) {
          if( activ_lines_list[phonCode] === this.allstate.room[roomIndex][person].starfacecode ) {
            this.allstate.room[roomIndex][person].line = "ON AIR";
            break;
          } else {
            this.allstate.room[roomIndex][person].line = "OFF AIR";
          }
        }
      }
    }
  }

  // ########## train info #######################


  if ( Math.round(( now_checktime - this.lastupdate) / 1000 ) > timeOut ) {
    this.getNextTrain();
  }

  /*! if time out all ready then reset timer. */
  if ( Math.round(( now_checktime - this.lastupdate) / 1000 ) > timeOut ) {
    this.lastupdate = now_checktime;
    console.log("update timestamp...");
  } else {
    console.log("es sind noch nicht " + timeOut + " Sek. vergangen: ");
    console.log( Math.round(( now_checktime - this.lastupdate) / 1000 ) );
  }
//   console.log(this.lastupdate);
//   console.log(now_checktime);

  console.log( "===>> Nähster Zug: "+ returnMinits);

//   console.log("JSON.stringify(this.allstate):" + JSON.stringify(this.allstate));
  res.render('status', {allstate: this.allstate, nexttrain: returnMinits } );
}


var onair2 = new OnAir2( new Date().getTime() );
module.exports = onair2;
