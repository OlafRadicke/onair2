
var http = require('http');
var htmlparser = require("htmlparser");

function MVVInfo(){

    /* URL configuration of mvv website */
    var options = {
        host: 'www.mvg-live.de',
        port: 80,
        path: '/ims/dfiStaticAuswahl.svc?haltestelle=Feldmoching+Bf.&sbahn=checkedm'
    };

    var minuts = null;
    var returnMinits = 999;
    this.getNextTrain  = function ()
    {
        return returnMinits;
    }

    this.siteRequest  = function ()
    {
        console.log("JSON.stringify(this.options): " + JSON.stringify( options ));
        console.log("this.options.host: " + options.host);
        http.get
        (
            options, function(res)
            {
        //     console.log("Got response: " + res.statusCode);
                res.on
                (
                    'data', function (rawHtml)
                    {
                        parsedSiteCode(rawHtml);
                    }
                );

              }
        ).on
        (
            'error', function(e)
            {
                console.log("Got error: " + e.message);
            }
        );
    }

    var parsedSiteCode = function (rawHtml) {
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
    };
}



var mvvinfo = new MVVInfo( );
module.exports = mvvinfo;
