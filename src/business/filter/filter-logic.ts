import {TuneBook} from '../model/tunebook';
import {TuneSet} from '../model/tuneset';
import {Tune} from '../model/tune';
import {Playlist} from '../model/playlist';
import {FilterSettings} from '../../common/settings/filter-settings';

export function filterTunes(tunes: Array<Tune>, filterSettings: FilterSettings): Array<Tune> {
    let titleMatch = false;
    let keyMatch = false;
    let typeMatch = false;
    let colorMatch = false;
    let tunesFiltered: Array<Tune> = [];

    for (let i = 0; i < tunes.length; i++) {
        titleMatch = false;
        keyMatch = false;
        typeMatch = false;
        colorMatch = false;

        if (filterSettings.title === "") {
            titleMatch = true;
        }

        if (filterSettings.key === "All Keys") {
            keyMatch = true;
        }

        if (filterSettings.type === "All Types") {
            typeMatch = true;
        }

        if (filterSettings.color === "All Colors") {
            colorMatch = true;
        }

        if (!keyMatch || !typeMatch || !colorMatch || !titleMatch) {

            if (!titleMatch && tunes[i].title.toLowerCase().indexOf(filterSettings.title) >= 0) {
                titleMatch = true;
            }

            if (!keyMatch && tunes[i].key === filterSettings.key) {
                keyMatch = true;
            }

            if (!typeMatch && tunes[i].type === filterSettings.type) {
                typeMatch = true;
            }

            if (!colorMatch && tunes[i].color.hex === filterSettings.color) {
                colorMatch = true;
            }
        }

        if (keyMatch && typeMatch && colorMatch && titleMatch) {
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
    let tuneSetsFiltered: Array<TuneSet> = [];
    let playlists: Array<Playlist> = [];
    let setIdMatch = false;
    let playlistIdMatch = false;

    for (let i = 0; i < tuneBook.tuneSets.length; i++) {
        titleMatch = false;
        keyMatch = false;
        typeMatch = false;
        colorMatch = false;
        eventMatch = false;
        bandMatch = false;
        setIdMatch = false;
        playlistIdMatch = false;

        if (filterSettings.setIds.length === 0 || !filterSettings.applySetIds) {
            setIdMatch = true;

        } else {
            setIdMatch = filterSettings.setIds.indexOf(tuneBook.tuneSets[i].id) > -1;
        }

        if (filterSettings.playlistIds.length === 0 || !filterSettings.applyPlaylistIds) {
            playlistIdMatch = true;

        } else {
            let setPlaylists: Array<Playlist> = tuneBook.getPlaylistsByTuneSetId(tuneBook.tuneSets[i].id);

            for (let z = 0; z < setPlaylists.length; z++) {
                for (let j = 0; j < filterSettings.playlistIds.length; j++) {
                    if (setPlaylists[z].id === filterSettings.playlistIds[j]) {
                        playlistIdMatch = true;
                    }
                }
            }
        }

        if (filterSettings.title === "") {
            titleMatch = true;
        }

        if (filterSettings.key === "All Keys") {
            keyMatch = true;
        }

        if (filterSettings.type === "All Types") {
            typeMatch = true;
        }

        if (filterSettings.color === "All Colors") {
            colorMatch = true;
        }

        if (filterSettings.event === "All Events") {
            eventMatch = true;
        }

        if (filterSettings.band === "All Bands") {
            bandMatch = true;
        }

        if (!eventMatch || !bandMatch) {
            playlists = tuneBook.getPlaylistsByTuneSetId(tuneBook.tuneSets[i].id);

            for (let y = 0; y < playlists.length; y++) {
                if (filterSettings.event == playlists[y].event) {
                    eventMatch = true;
                }

                if (filterSettings.band == playlists[y].band) {
                    bandMatch = true;
                }
            }
        }

        if (!keyMatch || !typeMatch || !colorMatch || !titleMatch) {

            for (let z = 0; z < tuneBook.tuneSets[i].tuneSetPositions.length; z++) {

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
            }
        }

        if (keyMatch && typeMatch && colorMatch && eventMatch && bandMatch && titleMatch && setIdMatch && playlistIdMatch) {
            tuneSetsFiltered.push(tuneBook.tuneSets[i]);
        }
    }

    return tuneSetsFiltered;
}

export function extractTunes(tuneSets: Array<TuneSet>): Array<Tune> {
    // Extract Tunes form TuneSets.
    let tunes: Array<Tune> = [];
    let addToTunes = false;

    for (let i = 0; i < tuneSets.length; i++) {
        for (let z = 0; z < tuneSets[i].tuneSetPositions.length; z++) {

            addToTunes = true;

            for (let y = 0; y < tunes.length; y++) {
                if (tunes[y].id == tuneSets[i].tuneSetPositions[z].tune.id) {
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

export function filterPlaylists(playlists: Array<Playlist>, filterSettings: FilterSettings, tuneSetsFiltered: Array<TuneSet>) {
    let playlistsFiltered: Array<Playlist> = [];
    let playlistIdMatch: boolean = false;
    //let playlistEventMatch: boolean = false;
    //let playlistBandMatch: boolean = false;
    let tuneSetMatch: boolean = false;


    for (let z = 0; z < playlists.length; z++) {
        playlistIdMatch = false;
        //playlistEventMatch = false;
        //playlistBandMatch = false;
        tuneSetMatch = false;

        if (filterSettings.applyPlaylistIds && filterSettings.playlistIds.length > 0) {
            for (let j = 0; j < filterSettings.playlistIds.length; j++) {
                if (!playlistIdMatch && playlists[z].id == filterSettings.playlistIds[j]) {
                    playlistIdMatch = true;
                }
            }
        } else {
            playlistIdMatch = true;
        }

        if (playlists[z].playlistPositions.length > 0) {
            for (let y = 0; y < playlists[z].playlistPositions.length; y++) {

                for (let a = 0; a < tuneSetsFiltered.length; a++) {
                    if (!tuneSetMatch && playlists[z].playlistPositions[y].tuneSet.id == tuneSetsFiltered[a].id) {
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
            playlistsFiltered.push(playlists[z]);
        }
    }

    return playlistsFiltered;
}
