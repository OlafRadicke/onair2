
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
    var returnMinutes = 999;
    this.getNextTrain  = function ()
    {
        return returnMinutes;
    }

    this.siteRequest  = function ()
    {
        http.get
        (
            options, function(res)
            {
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
          returnMinutes = 999;
          for (var i = 0; i < rowAll.length; i++) {
            try{
                statonName = rowAll[i]["children"][3]["children"][0]["data"];
            } catch (e) {
                console.log("Error: " + e);
                continue;
            }
            statonName = statonName.replace(/\t/g, '').replace(/\n/g, '').trim()
            if ( statonName.search("Ostbahnhof") > -1 || statonName.search("Hbf") > -1 ) {
                try{
                    minuts = rowAll[0]["children"][5]["children"][0]["data"];
                } catch (e) {
                    continue;
                }
                minuts = minuts - 7;
                if ( minuts > 0 && minuts < returnMinutes ) {
                  returnMinutes  = minuts;
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
