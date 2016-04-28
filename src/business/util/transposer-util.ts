import {Tune} from '../model/tune';

export function tuneDown(tune:Tune) {
    // Adaption of Jens Wollschl�ger's ABC-Transposer (http://www.8ung.at/abctransposer/)
    var neu = encodeURI(tune.pure);

    var Reihe = neu.split("%0D%0A");
    Reihe = neu.split("%0A");

    for (var i = 0; i < Reihe.length; ++i) {
        Reihe[i] = decodeURI(Reihe[i]); /* Macht die Steuerzeichen wieder weg */
        var Aktuellereihe = Reihe[i].split(""); /* nochmal bei C. Walshaw crosschecken, ob alle m�gl. ausser K: erfasst. */

        if ((Aktuellereihe[0] == "A" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "B" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "C" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "D" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "E" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "F" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "G" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "H" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "I" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "J" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "L" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "M" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "N" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "O" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "P" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "Q" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "R" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "S" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "T" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "U" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "V" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "W" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "X" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "Y" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "Z" && Aktuellereihe[1] == ":")) {
            /* Alle ausser K: und Melodieteile werden hier ignoriert. */

        } else if (Aktuellereihe[0] == "K" && Aktuellereihe[1] == ":") {
            /* k: Feld wird hier behandelt */

            var Leerzeichenweg = Reihe[i].split(" "); /* weil manchmal Leerzeichen nachm k */
            var sindweg = Leerzeichenweg.join("");
            Aktuellereihe = sindweg.split(""); /* den dritten ersetzen durch aktuellen Ton */

            if (Aktuellereihe[3] == "\#" || Aktuellereihe[3] == "b") {
                Aktuellereihe[3] = "";
            }

            if (Aktuellereihe[2] == "C") {
                Aktuellereihe[2] = "B";
                Reihe[i] = Aktuellereihe.join("");

            } else if (Aktuellereihe[2] == "D") {
                Aktuellereihe[2] = "C";
                Reihe[i] = Aktuellereihe.join("");

            } else if (Aktuellereihe[2] == "E") {
                Aktuellereihe[2] = "D";
                Reihe[i] = Aktuellereihe.join("");

            } else if (Aktuellereihe[2] == "F") {
                Aktuellereihe[2] = "E";
                Reihe[i] = Aktuellereihe.join("");

            } else if (Aktuellereihe[2] == "G") {
                Aktuellereihe[2] = "F";
                Reihe[i] = Aktuellereihe.join("");

            } else if (Aktuellereihe[2] == "A") {
                Aktuellereihe[2] = "G";
                Reihe[i] = Aktuellereihe.join("");

            } else if (Aktuellereihe[2] == "B") {
                Aktuellereihe[2] = "A";
                Reihe[i] = Aktuellereihe.join("");

            } else {
                /* nur f�r den Fall, falls korrupt */
            }
        } else {
            /* hier die Melodieabschnitte bearbeiten */

            var Derarray = Reihe[i].split("");

            for (var x = 0; x < Derarray.length; ++x) {
                /* zum Erstellen von a'' oder A,, -Klumpen */

                var allefertig = false;
                var mitzaehl = 0;

                if ((Derarray[x + 1] == "'") || (Derarray[x + 1] == ",")) {
                    do {
                        mitzaehl = mitzaehl + 1;
                        if (Derarray[x + mitzaehl] == "'") {
                            Derarray[x] = Derarray[x] + "'";
                            Derarray[x + mitzaehl] = ""; /* Arrays mit ' l�schen */

                        } else if (Derarray[x + mitzaehl] == ",") {
                            Derarray[x] = Derarray[x] + ",";
                            Derarray[x + mitzaehl] = ""; /* Arrays mit ' l�schen */

                        } else {
                            allefertig = true; /* wenn alle ' in dem Abschnitt fertig sind - Ende. */
                        }

                    } while (allefertig == false);

                } else {
                    /* wenn es kein Klumpen ist, hier erstmal nix ver�ndern */
                }
            }

            for (var y = 0; y < Derarray.length; ++y) {
                /* Tonh�he �ndern */
                var Miniarray = Derarray[y].split("");

                if (Miniarray[0] == "C" && Miniarray[1] == ",") {
                    /* Ausnahmefall 1 (, hinzuf�gen) */

                    Miniarray[0] = "B";
                    Miniarray[1] = ",,";

                } else if (Miniarray[0] == "c" && Miniarray[1] == "'") {
                    /* Ausnahmefall 2 (' hinzuf�gen) */

                    Miniarray[0] = "b";
                    Miniarray[1] = "";

                } else if (Miniarray[0] == "C") {
                    Miniarray[0] = "B,";

                } else if (Miniarray[0] == "D") {
                    Miniarray[0] = "C";

                } else if (Miniarray[0] == "E") {
                    Miniarray[0] = "D";

                } else if (Miniarray[0] == "F") {
                    Miniarray[0] = "E";

                } else if (Miniarray[0] == "G") {
                    Miniarray[0] = "F";

                } else if (Miniarray[0] == "A") {
                    Miniarray[0] = "G";

                } else if (Miniarray[0] == "B") {
                    Miniarray[0] = "A";

                } else if (Miniarray[0] == "c") {
                    Miniarray[0] = "B";

                } else if (Miniarray[0] == "d") {
                    Miniarray[0] = "c";

                } else if (Miniarray[0] == "e") {
                    Miniarray[0] = "d";

                } else if (Miniarray[0] == "f") {
                    Miniarray[0] = "e";

                } else if (Miniarray[0] == "g") {
                    Miniarray[0] = "f";

                } else if (Miniarray[0] == "a") {
                    Miniarray[0] = "g";

                } else if (Miniarray[0] == "b") {
                    Miniarray[0] = "a";
                }
                Derarray[y] = Miniarray.join("");
            }
            var alleszusammen = Derarray.join("");
            Reihe[i] = alleszusammen;
        }
    }

    tune.pure = Reihe.join("\n");
    return tune;
}

export function tuneUp(tune:Tune) {
    // Adaption of Jens Wollschl�ger's ABC-Transposer (http://www.8ung.at/abctransposer/)
    var neu = encodeURI(tune.pure);

    var Reihe = neu.split("%0D%0A");
    Reihe = neu.split("%0A");

    for (var i = 0; i < Reihe.length; ++i) {
        Reihe[i] = decodeURI(Reihe[i]); /* Macht die Steuerzeichen wieder weg */
        var Aktuellereihe = Reihe[i].split(""); /* nochmal bei C. Walshaw crosschecken, ob alle m�gl. ausser K: erfasst. */

        if ((Aktuellereihe[0] == "A" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "B" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "C" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "D" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "E" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "F" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "G" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "H" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "I" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "J" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "L" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "M" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "N" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "O" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "P" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "Q" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "R" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "S" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "T" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "U" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "V" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "W" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "X" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "Y" && Aktuellereihe[1] == ":") || (Aktuellereihe[0] == "Z" && Aktuellereihe[1] == ":")) {
            /* Alle ausser K: und Melodieteile werden hier ignoriert. */

        } else if (Aktuellereihe[0] == "K" && Aktuellereihe[1] == ":") {
            /* k: Feld wird hier behandelt */
            var Leerzeichenweg = Reihe[i].split(" "); /* weil manchmal Leerzeichen nachm k */
            var sindweg = Leerzeichenweg.join("");
            Aktuellereihe = sindweg.split(""); /* den dritten ersetzen durch aktuellen Ton */

            if (Aktuellereihe[3] == "\#" || Aktuellereihe[3] == "b") {
                Aktuellereihe[3] = "";
            }

            if (Aktuellereihe[2] == "C") {
                Aktuellereihe[2] = "D";
                /*
                if (vorzeichen == "raute"){
                  Aktuellereihe[2] = Aktuellereihe[2] + "\#";
                }
        
                if (vorzeichen == "b"){
                  Aktuellereihe[2] = Aktuellereihe[2] + "b";
                }
        
                if (vorzeichen == undefined){
                  Aktuellereihe[3] = "";
                }
                */
                Reihe[i] = Aktuellereihe.join("");

            } else if (Aktuellereihe[2] == "D") {
                Aktuellereihe[2] = "E";
                /*
                if (vorzeichen == "raute"){
                  Aktuellereihe[2] = Aktuellereihe[2] + "\#";
                }
        
                if (vorzeichen == "b"){
                  Aktuellereihe[2] = Aktuellereihe[2] + "b";
                }
        
                if (vorzeichen == undefined){
                  Aktuellereihe[3] = "";
                }
                */
                Reihe[i] = Aktuellereihe.join("");

            } else if (Aktuellereihe[2] == "E") {
                Aktuellereihe[2] = "F";

                /*
                if (vorzeichen == "raute") {
                  Aktuellereihe[2] = Aktuellereihe[2] + "\#";
                }
        
                if (vorzeichen == "b"){
                  Aktuellereihe[2] = Aktuellereihe[2] + "b";
                }
        
                if (vorzeichen == undefined){
                  Aktuellereihe[3] = "";
                }
                */
                Reihe[i] = Aktuellereihe.join("");

            } else if (Aktuellereihe[2] == "F") {
                Aktuellereihe[2] = "G";
                /*
                if(vorzeichen == "raute"){
                  Aktuellereihe[2] = Aktuellereihe[2] + "\#";
                }
        
                if (vorzeichen == "b"){
                  Aktuellereihe[2] = Aktuellereihe[2] + "b";
                }
        
                if (vorzeichen == undefined){
                  Aktuellereihe[3] = "";
                }
                */
                Reihe[i] = Aktuellereihe.join("");

            } else if (Aktuellereihe[2] == "G") {
                Aktuellereihe[2] = "A";

                /*
                if (vorzeichen == "raute" && (Aktuellereihe[3] != "\#" || Aktuellereihe[3] == "b")) {
                  Aktuellereihe[2] = Aktuellereihe[2] + "\#";
                }
        
                if (vorzeichen == "raute"){
                  Aktuellereihe[2] = Aktuellereihe[2] + "\#";
                }
        
                if (vorzeichen == "b"){
                  Aktuellereihe[2] = Aktuellereihe[2] + "b";
                }
                */
                Reihe[i] = Aktuellereihe.join("");

            } else if (Aktuellereihe[2] == "A") {
                Aktuellereihe[2] = "B";
                /*
                if (vorzeichen == "raute" && (Aktuellereihe[3] != "\#" || Aktuellereihe[3] == "b")) {
                  Aktuellereihe[2] = Aktuellereihe[2] + "\#";
                }
        
                if (vorzeichen == "raute"){
                  Aktuellereihe[2] = Aktuellereihe[2] + "\#";
                }
        
                if (vorzeichen == "b"){
                  Aktuellereihe[2] = Aktuellereihe[2] + "b";
                }
                */
                Reihe[i] = Aktuellereihe.join("");

            } else if (Aktuellereihe[2] == "B") {
                Aktuellereihe[2] = "C";
                /*
                if(vorzeichen == "raute" && (Aktuellereihe[3] != "\#" || Aktuellereihe[3] == "b")){
                  Aktuellereihe[2] = Aktuellereihe[2] + "\#";
                }
        
                if (vorzeichen == "raute") {
                  Aktuellereihe[2] = Aktuellereihe[2] + "\#";
                }
        
                if( vorzeichen == "b"){
                  Aktuellereihe[2] = Aktuellereihe[2] + "b";
                }
                */
                Reihe[i] = Aktuellereihe.join("");

            } else {
                /* nur f�r den Fall, falls korrupt */
            }

        } else {
            /* hier die Melodieabschnitte bearbeiten */
            var Derarray = Reihe[i].split("");

            for (var x = 0; x < Derarray.length; ++x) {
                /* zum Erstellen von a'' oder A,, -Klumpen */
                var allefertig = false;
                var mitzaehl = 0;

                if ((Derarray[x + 1] == "'") || (Derarray[x + 1] == ",")) {
                    do {
                        mitzaehl = mitzaehl + 1;

                        if (Derarray[x + mitzaehl] == "'") {
                            Derarray[x] = Derarray[x] + "'";
                            Derarray[x + mitzaehl] = ""; /* Arrays mit ' l�schen */

                        } else if (Derarray[x + mitzaehl] == ",") {
                            Derarray[x] = Derarray[x] + ",";
                            Derarray[x + mitzaehl] = ""; /* Arrays mit ' l�schen */

                        } else {
                            allefertig = true; /* wenn alle ' in dem Abschnitt fertig sind - Ende. */
                        }

                    } while (allefertig == false);

                } else {
                    /* wenn es kein Klumpen ist, hier erstmal nix ver�ndern */
                }
            }

            for (var y = 0; y < Derarray.length; ++y) {
                /* Tonh�he �ndern */
                var Miniarray = Derarray[y].split("");

                if (Miniarray[0] == "B" && Miniarray[1] == ",") {
                    /* Ausnahmefall 1 (, l�schen) */

                    Miniarray[0] = "C";
                    Miniarray[1] = "";

                } else if (Miniarray[0] == "b" && Miniarray[1] == "'") {
                    /* Ausnahmefall 2 (' hinzuf�gen) */

                    Miniarray[0] = "c";
                    Miniarray[1] = "''";

                } else if (Miniarray[0] == "C") {
                    Miniarray[0] = "D";

                } else if (Miniarray[0] == "D") {
                    Miniarray[0] = "E";

                } else if (Miniarray[0] == "E") {
                    Miniarray[0] = "F";

                } else if (Miniarray[0] == "F") {
                    Miniarray[0] = "G";

                } else if (Miniarray[0] == "G") {
                    Miniarray[0] = "A";

                } else if (Miniarray[0] == "A") {
                    Miniarray[0] = "B";

                } else if (Miniarray[0] == "B") {
                    Miniarray[0] = "c";

                } else if (Miniarray[0] == "c") {
                    Miniarray[0] = "d";

                } else if (Miniarray[0] == "d") {
                    Miniarray[0] = "e";

                } else if (Miniarray[0] == "e") {
                    Miniarray[0] = "f";

                } else if (Miniarray[0] == "f") {
                    Miniarray[0] = "g";

                } else if (Miniarray[0] == "g") {
                    Miniarray[0] = "a";

                } else if (Miniarray[0] == "a") {
                    Miniarray[0] = "b";

                } else if (Miniarray[0] == "b") {
                    Miniarray[0] = "c'";
                }
                Derarray[y] = Miniarray.join("");
            }
            var alleszusammen = Derarray.join("");
            Reihe[i] = alleszusammen;
        }
    }

    tune.pure = Reihe.join("\n");
    return tune;
}
