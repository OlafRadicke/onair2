
var execSync = require('exec-sync');
var fs = require('fs');
var htmlparser = require("htmlparser");
var http = require('http');


function OnAir2( initTimeStamp ) {
  this.lastupdate = initTimeStamp;
  this.statusFile = __dirname + '/models/status.json';
  var stringState = fs.readFileSync(this.statusFile,'utf8');
  this.allstate = JSON.parse(stringState);
}

OnAir2.prototype.getTimeStamp = function () {
  return this.lastupdate
}

OnAir2.prototype.getStatus = function (req, res) {
//   var asterisk_command = "ssh root@192.168.3.141 \"asterisk -vvvvvrx 'core show channels concise'\" | grep \"Up\" | grep -v \"None\" | cut -d'!' -f1";
  // test
  var asterisk_command = "echo \"SIP/ingrid\nSIP/pascal\nSIP/1240\"";
  var now_checktime = new Date().getTime();
  var timeOut = 60;

  if ( Math.round(( now_checktime - this.lastupdate) / 1000 ) > timeOut ) {
    this.lastupdate = now_checktime;
    console.log("update timestamp...");
  } else {
    console.log("es sind noch nicht " + timeOut + " Sek. vergangen: ");
    console.log( Math.round(( now_checktime - this.lastupdate) / 1000 ) );
  }
  console.log(this.lastupdate);
  console.log(now_checktime);


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
  var options = {
    host: 'www.mvg-live.de',
    port: 80,
    path: '/ims/dfiStaticAuswahl.svc?haltestelle=Feldmoching+Bf.&sbahn=checkedm'
  };

  http.get(options, function(res) {
    console.log("Got response: " + res.statusCode);
    res.on('data', function (rawHtml) {
      console.log('BODY: ' + rawHtml);

      var anyRow = null;
      var handler = new htmlparser.DefaultHandler(function(err, dom) {
        if (err) {
          sys.debug("Error: " + err);
        } else {
          var rowEven = htmlparser.DomUtils.getElements({ tag_name: "tr", class: "rowEven" }, dom);
          if ( rowEven != null ) {
//             console.log("---> rowEven: " + JSON.stringify(rowEven) );
            var statonName = rowEven[0]["children"][3]["children"][0]["data"];
            statonName = statonName.replace(/\t/g, '').replace(/\n/g, '')
            console.log("statonName: " );
            console.log( statonName );
            console.log("---> rowEven::minuten: " + JSON.stringify(rowEven[0]["children"][5]["children"][0]["data"] ) );
          }

          var rowOdd = htmlparser.DomUtils.getElements({ tag_name: "tr", class: "rowOdd" }, dom);
          if ( rowOdd != null ) {
//             console.log("---> rowOdd: " + JSON.stringify(rowOdd) );
            var statonName = rowOdd[0]["children"][3]["children"][0]["data"];
            statonName = statonName.replace(/\t/g, '').replace(/\n/g, '')
            console.log("statonName: " );
            console.log( statonName );
            console.log("---> rowOdd::minuten: " + JSON.stringify(rowOdd[0]["children"][5]["children"][0]["data"] ) );
          }
        }
      }, { verbose: false });
      var parser = new htmlparser.Parser(handler);
      parser.parseComplete(rawHtml);


    });

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });

//   console.log("JSON.stringify(this.allstate):" + JSON.stringify(this.allstate));
  res.render('status', {allstate: this.allstate} );
}


var onair2 = new OnAir2( new Date().getTime() );
module.exports = onair2;
