onair2
======

ABHÄNGIGKEITEN
--------------

* [Node.js](http://nodejs.org/)
* [NPM](https://www.npmjs.org/)
* [Make](http://www.gnu.org/software/make/)


GETESTET MIT
------------
* FEDORA 20

BUILD
-----

Rufe den Befehl

    make dist

auf oder

    make dist-tar

wenn du ein Tar-File möchtest.


INSTALLATION
------------

Entpacke das Tar-File; wechsel in das Verzeichnis "onair2-x" und führe den
Befehl

     make install

aus.

UPDATE
------

Tar-File entpacken und in das Verzeichnis "onair2-x" wechseln. Dort den Befehl

    make update

aufrufen.


KONFIGURATION
-------------

localhost:8080/admin aufrufen



### Beispielkonfiguration:

     {
       "room": {
         "Empfang": [
           {
             "name": "Michael",
             "starfacecode": "SIP/1051.tiptel286",
             "line": "OFF AIR",
             "number": "0"
           }
         ],
         "Technik": [
           {
             "name": "Peter",
             "starfacecode": "SIP/peter",
             "line": "OFF AIR",
             "number": "666"
           },
           {
             "name": "Thomas",
            "starfacecode": "SIP/1358.tiptel286",
            "line": "OFF AIR",
            "number": "333"
          }
        ],
        "Vertrieb": [
          {
            "name": "Sabine",
            "starfacecode": "SIP/Gigaset3",
            "line": "OFF AIR",
            "number": "101"
          },
          {
            "name": "Klaus",
            "starfacecode": "SIP/klaus",
            "line": "OFF AIR",
            "number": "102"
          }
        ]
      }
    }
