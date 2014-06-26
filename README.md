onair2
======

INSTALLATION
------------

UPDATE
------

* Die Datei ./src/app/models/status.json sichern.
* Alle Dateien löschen.
* Neue Version in das Verzeichnis kopieren.
* Die gesicherte Datei nach ./src/app/models/status.json zurückkopieren.

KONFIGURATION
-------------

localhost:8080/admin aufrufen

Beispielkonfiguration:
> ## Beispielkonfiguration:
>
> {
>   "room": {
>     "Empfang": [
>       {
>         "name": "Michael",
>         "starfacecode": "SIP/1051.tiptel286",
>         "line": "OFF AIR",
>         "number": "0"
>       }
>     ],
>     "Technik": [
>       {
>         "name": "Peter",
>         "starfacecode": "SIP/peter",
>         "line": "OFF AIR",
>         "number": "666"
>       },
>       {
>         "name": "Thomas",
>        "starfacecode": "SIP/1358.tiptel286",
>        "line": "OFF AIR",
>        "number": "333"
>      }
>    ],
>    "Vertrieb": [
>      {
>        "name": "Sabine",
>        "starfacecode": "SIP/Gigaset3",
>        "line": "OFF AIR",
>        "number": "101"
>      },
>      {
>        "name": "Klaus",
>        "starfacecode": "SIP/klaus",
>        "line": "OFF AIR",
>        "number": "102"
>      }
>    ]
>  }
>}
