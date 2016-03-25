import * as moment from 'moment';
import {TuneBook} from '../model/tunebook';
import {TuneSet} from '../model/tuneset';
import {Tune} from '../model/tune';
import {Playlist} from '../model/playlist';
import {FilterSettings} from '../../common/settings/filter-settings';

export function filterTunes(tunes: Array<Tune>, filterSettings: FilterSettings): Array<Tune> {
    var titleMatch = false;
    var keyMatch = false;
    var typeMatch = false;
    var colorMatch = false;
    var playMatch = false;
    var playMin, playMax, updateMin, updateMax;
    var freqMatch = false;
    var updateMatch = false;
    var tunesFiltered = [];

    for (var i = 0; i < tunes.length; i++) {
        titleMatch = false;
        keyMatch = false;
        typeMatch = false;
        colorMatch = false;
        playMatch = false;
        freqMatch = false;
        updateMatch = false;

        if (filterSettings.title == "") {
            titleMatch = true;
        }

        if (filterSettings.key == "All Keys") {
            keyMatch = true;
        }

        if (filterSettings.type == "All Types") {
            typeMatch = true;
        }

        if (filterSettings.color == "All Colors") {
            colorMatch = true;
        }

        if (filterSettings.plmin == "" || filterSettings.plmin == "05.10.2012" || filterSettings.plmin == null
            || filterSettings.plmax == "" || filterSettings.plmax == null) {
            playMatch = true;
        } else {
            playMin = moment(filterSettings.plmin, 'DD.MM.YYYY').startOf('day');
            playMax = moment(filterSettings.plmax, 'DD.MM.YYYY').endOf('day');
        }

        if (filterSettings.updmin == "" || filterSettings.updmin == "05.10.2012" || filterSettings.updmin == null
            || filterSettings.updmax == "" || filterSettings.updmax == null) {
            updateMatch = true;
        } else {
            updateMin = moment(filterSettings.updmin, 'DD.MM.YYYY').startOf('day');
            updateMax = moment(filterSettings.updmax, 'DD.MM.YYYY').endOf('day');
        }

        if (filterSettings.freqcomp == "" || filterSettings.freqcomp == null
            || filterSettings.freq == "" || filterSettings.freq == null) {
            freqMatch = true;
        }

        if (!keyMatch || !typeMatch || !colorMatch || !playMatch || !updateMatch || !freqMatch || !titleMatch) {

            if (!titleMatch && tunes[i].title.toLowerCase().indexOf(filterSettings.title) >= 0) {
                titleMatch = true;
            }

            if (!keyMatch && tunes[i].key == filterSettings.key) {
                keyMatch = true;
            }

            if (!typeMatch && tunes[i].type == filterSettings.type) {
                typeMatch = true;
            }

            if (!colorMatch && tunes[i].color.hex == filterSettings.color) {
                colorMatch = true;
            }

            if (!playMatch && tunes[i].lastPlayed != null) {
                var lastPlayed = moment(tunes[i].lastPlayed);
                if (!(lastPlayed.isBefore(playMin))
                    && !(lastPlayed.isAfter(playMax))) {

                    playMatch = true;
                }
            }

            if (!updateMatch && tunes[i].lastModified != null) {
                var lastModified = moment(tunes[i].lastModified);
                if (!(lastModified.isBefore(updateMin))
                    && !(lastModified.isAfter(updateMax))) {

                    updateMatch = true;
                }
            }

            if (!freqMatch) {
                if ((filterSettings.freqcomp == "LT" && tunes[i].frequencyPlayed < parseInt(filterSettings.freq))
                    || (filterSettings.freqcomp == "GE" && tunes[i].frequencyPlayed >= parseInt(filterSettings.freq))) {

                    freqMatch = true;
                }
            }

        }

        if (keyMatch && typeMatch && colorMatch && playMatch && updateMatch && freqMatch && titleMatch) {
            tunesFiltered.push(tunes[i]);
        }
    }

    return tunesFiltered;
}

export function filterTuneSets(tuneBook: TuneBook, filterSettings: FilterSettings): Array<TuneSet> {
    let titleMatch = false;
    let keyMatch = false;
    let typeMatch = false;
    let colorMatch = false;
    let eventMatch = false;
    let bandMatch = false;
    let playMatch = false;
    let playMin, playMax, updateMin, updateMax;
    let freqMatch = false;
    let updateMatch = false;
    let tuneSetsFiltered = [];
    let playlists;
    let setIdMatch = false;
    let playlistIdMatch = false;

    for (var i = 0; i < tuneBook.tuneSets.length; i++) {
        titleMatch = false;
        keyMatch = false;
        typeMatch = false;
        colorMatch = false;
        eventMatch = false;
        bandMatch = false;
        playMatch = false;
        freqMatch = false;
        updateMatch = false;
        setIdMatch = false;
        playlistIdMatch = false;

        if (filterSettings.setIds.length == 0 || !filterSettings.applySetIds) {
            setIdMatch = true;

        } else {
            setIdMatch = filterSettings.setIds.indexOf(tuneBook.tuneSets[i].tuneSetId) > -1;
        }

        if (filterSettings.playlistIds.length == 0 || !filterSettings.applyPlaylistIds) {
            playlistIdMatch = true;

        } else {
            let setPlaylists: Array<Playlist> = tuneBook.getPlaylistsByTuneSetId(tuneBook.tuneSets[i].tuneSetId);

            for (var z = 0; z < setPlaylists.length; z++) {
                for (var j = 0; j < filterSettings.playlistIds.length; j++) {
                    if (setPlaylists[z].id == filterSettings.playlistIds[j]) {
                        playlistIdMatch = true;
                    }
                }
            }
        }

        if (filterSettings.title == "") {
            titleMatch = true;
        }

        if (filterSettings.key == "All Keys") {
            keyMatch = true;
        }

        if (filterSettings.type == "All Types") {
            typeMatch = true;
        }

        if (filterSettings.color == "All Colors") {
            colorMatch = true;
        }

        if (filterSettings.plmin == "" || filterSettings.plmin == "05.10.2012" || filterSettings.plmin == null
            || filterSettings.plmax == "" || filterSettings.plmax == null) {
            playMatch = true;
        } else {
            playMin = moment(filterSettings.plmin, 'DD.MM.YYYY').startOf('day');
            playMax = moment(filterSettings.plmax, 'DD.MM.YYYY').endOf('day');
        }

        if (filterSettings.updmin == "" || filterSettings.updmin == "05.10.2012" || filterSettings.updmin == null
            || filterSettings.updmax == "" || filterSettings.updmax == null) {
            updateMatch = true;
        } else {
            updateMin = moment(filterSettings.updmin, 'DD.MM.YYYY').startOf('day');
            updateMax = moment(filterSettings.updmax, 'DD.MM.YYYY').endOf('day');
        }

        if (filterSettings.freqcomp == "" || filterSettings.freqcomp == null
            || filterSettings.freq == "" || filterSettings.freq == null) {
            freqMatch = true;
        }

        if (filterSettings.event == "All Events") {
            eventMatch = true;
        }

        if (filterSettings.band == "All Bands") {
            bandMatch = true;
        }

        if (!eventMatch || !bandMatch) {
            playlists = tuneBook.getPlaylistsByTuneSetId(tuneBook.tuneSets[i].tuneSetId);

            for (var y = 0; y < playlists.length; y++) {
                if (filterSettings.event == playlists[y].event) {
                    eventMatch = true;
                }

                if (filterSettings.band == playlists[y].band) {
                    bandMatch = true;
                }
            }
        }

        if (!keyMatch || !typeMatch || !colorMatch || !playMatch || !updateMatch || !freqMatch || !titleMatch) {

            for (var z = 0; z < tuneBook.tuneSets[i].tuneSetPositions.length; z++) {

                if (!titleMatch && tuneBook.tuneSets[i].tuneSetPositions[z].tune.title.toLowerCase().indexOf(filterSettings.title) >= 0) {
                    titleMatch = true;
                }

                if (!keyMatch && tuneBook.tuneSets[i].tuneSetPositions[z].tune.key == filterSettings.key) {
                    keyMatch = true;
                }

                if (!typeMatch && tuneBook.tuneSets[i].tuneSetPositions[z].tune.type == filterSettings.type) {
                    typeMatch = true;
                }

                if (!colorMatch && tuneBook.tuneSets[i].tuneSetPositions[z].tune.color.getHexValue() == filterSettings.color) {
                    colorMatch = true;
                }

                if (!playMatch && tuneBook.tuneSets[i].tuneSetPositions[z].tune.lastPlayed != null) {
                    var lastPlayed = moment(tuneBook.tuneSets[i].tuneSetPositions[z].tune.lastPlayed);
                    if (!(lastPlayed.isBefore(playMin))
                        && !(lastPlayed.isAfter(playMax))) {

                        playMatch = true;
                    }
                }

                if (!updateMatch && tuneBook.tuneSets[i].tuneSetPositions[z].tune.lastModified != null) {
                    var lastModified = moment(tuneBook.tuneSets[i].tuneSetPositions[z].tune.lastModified);
                    if (!(lastModified.isBefore(updateMin))
                        && !(lastModified.isAfter(updateMax))) {

                        updateMatch = true;
                    }
                }

                if (!freqMatch) {
                    if ((filterSettings.freqcomp == "LT" && tuneBook.tuneSets[i].tuneSetPositions[z].tune.frequencyPlayed < parseInt(filterSettings.freq))
                        || (filterSettings.freqcomp == "GE" && tuneBook.tuneSets[i].tuneSetPositions[z].tune.frequencyPlayed >= parseInt(filterSettings.freq))) {

                        freqMatch = true;
                    }
                }
            }
        }

        if (keyMatch && typeMatch && colorMatch && eventMatch && bandMatch && playMatch && updateMatch && freqMatch && titleMatch && setIdMatch && playlistIdMatch) {
            tuneSetsFiltered.push(tuneBook.tuneSets[i]);
        }
    }

    return tuneSetsFiltered;
}

export function extractSetsWithinPlayDatePeriod(tuneBook, playDateFilter) {
    // Extract Tunes form TuneSets.
    var sets = [];
    var tunePlayedWithinPlayDatePeriod = true;
    var tunesPlayedWithinPlayDatePeriod = 0;

    if (tuneBook != null) {
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

                    if (checkDay != null && checkDay != undefined) {
                        days = today.diff(checkDay, 'days');

                        if (playDateFilter == "All Sets") {

                        } else {
                            if (playDateFilter == "Played Last Day" && days > 1) {
                                tunePlayedWithinPlayDatePeriod = false;
                            } else if (playDateFilter == "Played Last Week" && days > 7) {
                                tunePlayedWithinPlayDatePeriod = false;
                            } else if (playDateFilter == "Played Last Month" && days > 30) {
                                tunePlayedWithinPlayDatePeriod = false;
                            } else if (playDateFilter == "Played Last Year" && days > 365) {
                                tunePlayedWithinPlayDatePeriod = false;
                            } else if (playDateFilter == "Played Never") {
                                tunePlayedWithinPlayDatePeriod = false;
                            }
                        }
                    } else {
                        if (playDateFilter == "Played Never") {

                        } else {
                            tunePlayedWithinPlayDatePeriod = false;
                        }
                    }

                    if (tunePlayedWithinPlayDatePeriod) {
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

/*
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
*/

export function extractTunes(tuneSets: Array<TuneSet>): Array<Tune> {
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

export function extractTuneSetPositions(tuneSets) {
    // Extract TuneSetPositions from TuneSets.
    var tuneSetPositions = [];

    for (var i = 0; i < tuneSets.length; i++) {
        for (var z = 0; z < tuneSets[i].tuneSetPositions.length; z++) {
            tuneSetPositions.push(tuneSets[i].tuneSetPositions[z]);
        }
    }

    return tuneSetPositions;
}

export function filterPlaylists(playlists: Array<Playlist>, filterSettings: FilterSettings, tuneSetsFiltered: Array<TuneSet>) {
    let playlistsFiltered: Array<Playlist> = [];
    let playlistIdMatch: boolean = false;
    //let playlistEventMatch: boolean = false;
    //let playlistBandMatch: boolean = false;
    let tuneSetMatch: boolean = false;


    for (var z = 0; z < playlists.length; z++) {
        playlistIdMatch = false;
        //playlistEventMatch = false;
        //playlistBandMatch = false;
        tuneSetMatch = false;

        if (filterSettings.applyPlaylistIds && filterSettings.playlistIds.length > 0) {
            for (var j = 0; j < filterSettings.playlistIds.length; j++) {
                if (!playlistIdMatch && playlists[z].id == filterSettings.playlistIds[j]) {
                    playlistIdMatch = true;
                }
            }
        } else {
            playlistIdMatch = true;
        }

        if (playlists[z].playlistPositions.length > 0) {
            for (var y = 0; y < playlists[z].playlistPositions.length; y++) {

                for (var a = 0; a < tuneSetsFiltered.length; a++) {
                    if (!tuneSetMatch && playlists[z].playlistPositions[y].tuneSet.tuneSetId == tuneSetsFiltered[a].tuneSetId) {
                        tuneSetMatch = true;
                    }
                }
            }

        } else {
            //New Playlist
            tuneSetMatch = true;
        }

        /*
        if (filterSettings.event == "All Events" || playlists[z].event == filterSettings.event) {
            playlistEventMatch = true;
        }

        if (filterSettings.band == "All Bands" || playlists[z].band == filterSettings.band) {
            playlistBandMatch = true;
        }    
        
        if (playlistIdMatch && playlistEventMatch && playlistBandMatch) {
            playlistsFiltered.push(playlists[z])
        }
        */

        if (playlistIdMatch && tuneSetMatch) {
            playlistsFiltered.push(playlists[z])
        }
    }

    return playlistsFiltered;
}