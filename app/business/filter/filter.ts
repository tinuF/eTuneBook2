import {TuneBook} from '../model/tunebook';
import {TuneSet} from '../model/tuneset';
import {Tune} from '../model/tune';

export function filterTunes(tunes:Array<Tune>, filterOptions):Array<Tune>{
    var keyMatch = false;
    var typeMatch = false;
    var colorMatch = false;
    var playMatch = false;
    var playMin, playMax, updateMin, updateMax;
    var freqMatch = false;
    var updateMatch = false;
    var tunesFiltered = [];

    for (var i = 0; i < tunes.length; i++) {
        keyMatch = false;
        typeMatch = false;
        colorMatch = false;
        playMatch = false;
        freqMatch = false;
        updateMatch = false;

        if (filterOptions.key == "" || filterOptions.key == "All Keys" || filterOptions.key == null) {
            keyMatch = true;
        }

        if (filterOptions.type == "" || filterOptions.type == "All Types" || filterOptions.type == null) {
            typeMatch = true;
        }

        if (filterOptions.color == "" || filterOptions.color == "All Colors" || filterOptions.color == null) {
            colorMatch = true;
        }

        if (filterOptions.plmin == "" || filterOptions.plmin == "05.10.2012" || filterOptions.plmin == null
            || filterOptions.plmax == "" || filterOptions.plmax == null) {
            playMatch = true;
        } else {
            playMin = moment(filterOptions.plmin, 'DD.MM.YYYY').startOf('day');
            playMax = moment(filterOptions.plmax, 'DD.MM.YYYY').endOf('day');
        }

        if (filterOptions.updmin == "" || filterOptions.updmin == "05.10.2012" || filterOptions.updmin == null
            || filterOptions.updmax == "" || filterOptions.updmax == null) {
            updateMatch = true;
        } else {
            updateMin = moment(filterOptions.updmin, 'DD.MM.YYYY').startOf('day');
            updateMax = moment(filterOptions.updmax, 'DD.MM.YYYY').endOf('day');
        }

        if (filterOptions.freqcomp == "" || filterOptions.freqcomp == null
            || filterOptions.freq == "" || filterOptions.freq == null) {
            freqMatch = true;
        }

        if (!keyMatch || !typeMatch || !colorMatch || !playMatch || !updateMatch || !freqMatch) {

            if (!keyMatch && tunes[i].key == filterOptions.key) {
                keyMatch = true;
            }

            if (!typeMatch && tunes[i].type == filterOptions.type) {
                typeMatch = true;
            }

            if (!colorMatch && tunes[i].color == filterOptions.color) {
                colorMatch = true;
            }

            if (!playMatch && tunes[i].lastPlayed != null ) {
                var lastPlayed = moment(tunes[i].lastPlayed);
                if(!(lastPlayed.isBefore(playMin))
                    && !(lastPlayed.isAfter(playMax))){

                    playMatch = true;
                }
            }

            if (!updateMatch && tunes[i].lastModified != null ) {
                var lastModified = moment(tunes[i].lastModified);
                if(!(lastModified.isBefore(updateMin))
                    && !(lastModified.isAfter(updateMax))){

                    updateMatch = true;
                }
            }

            if (!freqMatch) {
                if ((filterOptions.freqcomp == "LT" && tunes[i].frequencyPlayed < parseInt(filterOptions.freq))
                    || (filterOptions.freqcomp == "GE" && tunes[i].frequencyPlayed >= parseInt(filterOptions.freq)) )  {

                    freqMatch = true;
                }
            }

        }

        if (keyMatch && typeMatch && colorMatch && playMatch && updateMatch && freqMatch){
            tunesFiltered.push(tunes[i]);
        }
    }

    return tunesFiltered;
}

export function filterTuneSets(tuneBook:TuneBook, filterOptions):Array<TuneSet>{
    var keyMatch = false;
    var typeMatch = false;
    var colorMatch = false;
    var eventMatch = false;
    var bandMatch = false;
    var playMatch = false;
    var playMin, playMax, updateMin, updateMax;
    var freqMatch = false;
    var updateMatch = false;
    var tuneSetsFiltered = [];
    var playlists;

    for (var i = 0; i < tuneBook.tuneSets.length; i++) {
        keyMatch = false;
        typeMatch = false;
        colorMatch = false;
        eventMatch = false;
        bandMatch = false;
        playMatch = false;
        freqMatch = false;
        updateMatch = false;

        if (filterOptions.key == "" || filterOptions.key == "All Keys" || filterOptions.key == null) {
            keyMatch = true;
        }

        if (filterOptions.type == "" || filterOptions.type == "All Types" || filterOptions.type == null) {
            typeMatch = true;
        }

        if (filterOptions.color == "" || filterOptions.color == "All Colors" || filterOptions.color == null) {
            colorMatch = true;
        }

        if (filterOptions.plmin == "" || filterOptions.plmin == "05.10.2012" || filterOptions.plmin == null
            || filterOptions.plmax == "" || filterOptions.plmax == null) {
            playMatch = true;
        } else {
            playMin = moment(filterOptions.plmin, 'DD.MM.YYYY').startOf('day');
            playMax = moment(filterOptions.plmax, 'DD.MM.YYYY').endOf('day');
        }

        if (filterOptions.updmin == "" || filterOptions.updmin == "05.10.2012" || filterOptions.updmin == null
            || filterOptions.updmax == "" || filterOptions.updmax == null) {
            updateMatch = true;
        } else {
            updateMin = moment(filterOptions.updmin, 'DD.MM.YYYY').startOf('day');
            updateMax = moment(filterOptions.updmax, 'DD.MM.YYYY').endOf('day');
        }

        if (filterOptions.freqcomp == "" || filterOptions.freqcomp == null
            || filterOptions.freq == "" || filterOptions.freq == null) {
            freqMatch = true;
        }

        if (filterOptions.event == ""
            || filterOptions.event == "All Events"
            || filterOptions.event == null) {

            eventMatch = true;
        }

        if (filterOptions.band == ""
            || filterOptions.band == "All Bands"
            || filterOptions.band == null) {

            bandMatch = true;
        }

        if (!eventMatch || !bandMatch){
            playlists = tuneBook.getPlaylistsByTuneSetId(tuneBook.tuneSets[i].tuneSetId);

            for (var y = 0; y < playlists.length; y++) {
                if (filterOptions.event == playlists[y].event) {
                    eventMatch = true;
                }

                if (filterOptions.band == playlists[y].band) {
                    bandMatch = true;
                }
            }
        }

        if (!keyMatch || !typeMatch || !colorMatch || !playMatch || !updateMatch || !freqMatch) {
            for (var z = 0; z < tuneBook.tuneSets[i].tuneSetPositions.length; z++) {
                if (!keyMatch && tuneBook.tuneSets[i].tuneSetPositions[z].tune.key == filterOptions.key) {
                    keyMatch = true;
                }

                if (!typeMatch && tuneBook.tuneSets[i].tuneSetPositions[z].tune.type == filterOptions.type) {
                    typeMatch = true;
                }

                if (!colorMatch && tuneBook.tuneSets[i].tuneSetPositions[z].tune.color == filterOptions.color) {
                    colorMatch = true;
                }

                if (!playMatch && tuneBook.tuneSets[i].tuneSetPositions[z].tune.lastPlayed != null ) {
                    var lastPlayed = moment(tuneBook.tuneSets[i].tuneSetPositions[z].tune.lastPlayed);
                    if(!(lastPlayed.isBefore(playMin))
                        && !(lastPlayed.isAfter(playMax))){

                        playMatch = true;
                    }
                }

                if (!updateMatch && tuneBook.tuneSets[i].tuneSetPositions[z].tune.lastModified != null ) {
                    var lastModified = moment(tuneBook.tuneSets[i].tuneSetPositions[z].tune.lastModified);
                    if(!(lastModified.isBefore(updateMin))
                        && !(lastModified.isAfter(updateMax))){

                        updateMatch = true;
                    }
                }

                if (!freqMatch) {
                    if ((filterOptions.freqcomp == "LT" && tuneBook.tuneSets[i].tuneSetPositions[z].tune.frequencyPlayed < parseInt(filterOptions.freq))
                        || (filterOptions.freqcomp == "GE" && tuneBook.tuneSets[i].tuneSetPositions[z].tune.frequencyPlayed >= parseInt(filterOptions.freq)) )  {

                        freqMatch = true;
                    }
                }
            }
        }

        if (keyMatch && typeMatch && colorMatch && eventMatch && bandMatch && playMatch && updateMatch && freqMatch){
            tuneSetsFiltered.push(tuneBook.tuneSets[i]);
        }
    }

    return tuneSetsFiltered;
}

export function extractSetsWithinPlayDatePeriod(tuneBook, playDateFilter){
    // Extract Tunes form TuneSets.
    var sets = [];
    var tunePlayedWithinPlayDatePeriod = true;
    var tunesPlayedWithinPlayDatePeriod = 0;

    if (tuneBook != null){
        for (var i = 0; i < tuneBook.tuneSets.length; i++) {
            tunePlayedWithinPlayDatePeriod = true;
            tunesPlayedWithinPlayDatePeriod = 0;

            for (var z = 0; z < tuneBook.tuneSets[i].tuneSetPositions.length; z++) {
                var today = moment();
                var days = 0;

                days = 0;

                var playDate = tuneBook.tuneSets[i].tuneSetPositions[z].tune.lastPlayed

                if (playDate != undefined && playDate != null) {

                    var checkDay = moment(tuneBook.tuneSets[i].tuneSetPositions[z].tune.lastPlayed);

                    if (checkDay != null && checkDay != undefined){
                        days = today.diff(checkDay, 'days');

                        if (playDateFilter == "All Sets"){

                        } else {
                            if (playDateFilter == "Played Last Day" &&  days > 1) {
                                tunePlayedWithinPlayDatePeriod = false;
                            } else if (playDateFilter == "Played Last Week" &&  days > 7) {
                                tunePlayedWithinPlayDatePeriod = false;
                            } else if (playDateFilter == "Played Last Month" &&  days > 30) {
                                tunePlayedWithinPlayDatePeriod = false;
                            } else if (playDateFilter == "Played Last Year" &&  days > 365) {
                                tunePlayedWithinPlayDatePeriod = false;
                            } else if (playDateFilter == "Played Never") {
                                tunePlayedWithinPlayDatePeriod = false;
                            }
                        }
                    } else {
                        if (playDateFilter == "Played Never"){

                        } else {
                            tunePlayedWithinPlayDatePeriod = false;
                        }
                    }

                    if (tunePlayedWithinPlayDatePeriod){
                        tunesPlayedWithinPlayDatePeriod = tunesPlayedWithinPlayDatePeriod + 1;
                    }

                }
            }

            if (tunesPlayedWithinPlayDatePeriod > 0) {
                sets.push(tuneBook.tuneSets[i]);
            }
        }
    }

    return sets;
}

export function extractTunesWithinPlayDatePeriod(tuneBook, playDateFilter){
    // Extract Tunes form TuneSets.
    var tunes = [];
    var addToTunes = false;

    if (tuneBook != null){
        for (var i = 0; i < tuneBook.tuneSets.length; i++) {
            for (var z = 0; z < tuneBook.tuneSets[i].tuneSetPositions.length; z++) {

                addToTunes = true;

                var today = moment();
                var days = 0;

                days = 0;

                var playDate = tuneBook.tuneSets[i].tuneSetPositions[z].tune.lastPlayed

                if (playDate != undefined && playDate != null) {
                    var checkDay = moment(tuneBook.tuneSets[i].tuneSetPositions[z].tune.lastPlayed);

                    if (checkDay != null && checkDay != undefined){
                        days = today.diff(checkDay, 'days');

                        if (playDateFilter == "All Tunes"){

                        } else {
                            if (playDateFilter == "Played Last Day" &&  days > 1) {
                                addToTunes = false;
                            } else if (playDateFilter == "Played Last Week" &&  days > 7) {
                                addToTunes = false;
                            } else if (playDateFilter == "Played Last Month" &&  days > 30) {
                                addToTunes = false;
                            } else if (playDateFilter == "Played Last Year" &&  days > 365) {
                                addToTunes = false;
                            } else if (playDateFilter == "Played Never") {
                                addToTunes = false;
                            }
                        }
                    } else {
                        if (playDateFilter == "Played Never"){

                        } else {
                            addToTunes = false;
                        }
                    }



                    for (var y = 0; y < tunes.length; y++) {
                        if (tunes[y].intTuneId == tuneBook.tuneSets[i].tuneSetPositions[z].tune.intTuneId) {
                            addToTunes = false;
                        }
                    }
                    if (addToTunes) {
                        tunes.push(tuneBook.tuneSets[i].tuneSetPositions[z].tune);
                    }
                }
            }
        }
    }

    return tunes;
}

export function extractTunes(tuneSets:Array<TuneSet>):Array<Tune>{
    // Extract Tunes form TuneSets.
    var tunes = [];
    var addToTunes = false;

    for (var i = 0; i < tuneSets.length; i++) {
        for (var z = 0; z < tuneSets[i].tuneSetPositions.length; z++) {

            addToTunes = true;

            for (var y = 0; y < tunes.length; y++) {
                if (tunes[y].intTuneId == tuneSets[i].tuneSetPositions[z].tune.intTuneId) {
                    addToTunes = false;
                }
            }
            if (addToTunes) {
                tunes.push(tuneSets[i].tuneSetPositions[z].tune);
            }
        }
    }

    return tunes;
}

export function extractTuneSetPositions(tuneSets){
    // Extract TuneSetPositions from TuneSets.
    var tuneSetPositions = [];

    for (var i = 0; i < tuneSets.length; i++) {
        for (var z = 0; z < tuneSets[i].tuneSetPositions.length; z++) {
            tuneSetPositions.push(tuneSets[i].tuneSetPositions[z]);
        }
    }

    return tuneSetPositions;
}
