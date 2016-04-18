import {getSystemProperties} from '../../common/system-properties';
import {getAbcValue} from '../util/abc-util';
import {importTuneSets} from '../converter/tuneset-importer';
import {importPlaylists, importPlaylistPositions, importTuneSetPositionPlayInfos} from '../converter/playlists-importer';
import {extractTunes, extractTuneSetPositions} from '../filter/filter-logic';
import {writeAbcHeader, writeTuneAbc} from '../converter/abc-writer';
import {TuneSet} from './tuneset';
import {Tune} from './tune';
import {TuneSetPosition} from './tunesetposition';
import {Playlist} from './playlist';
import {PlaylistPosition} from './playlistposition';
import {TuneSetPositionPlayInfo} from './tunesetposition-playinfo';
import {PartPlayInfo} from './partplayinfo';
import {AbcExportSettings} from '../../common/settings/abc-export-settings';


export class TuneBook {
    _systemProperties;
    abcjsBook: any;
    header: any;
    name: string;
    version: string;
    description: string;
    tuneSets: Array<TuneSet>;
    playlists: Array<Playlist>;
    tuneSetPositionPlayInfos: Array<TuneSetPositionPlayInfo>;

    constructor(abc) {
        this._systemProperties = getSystemProperties();

        // split the file into individual tunes.
        this.abcjsBook = new ABCJS.TuneBook(abc);

        this.header = this.abcjsBook.header;
        this.name = getAbcValue(this.header, "%%etbk:bname ", "");
        this.version = getAbcValue(this.header, "%%etbk:bvers ", "");
        this.description = getAbcValue(this.header, "%%etbk:bdesc ", "");
        this.tuneSets = [];
        this.playlists = [];
        this.tuneSetPositionPlayInfos = [];

        this.extract();
    }

    extract() {
        this.tuneSets = importTuneSets(this.abcjsBook);   //TuneSets zuerst, weil Playlists auf TuneSets referenzieren
        this.playlists = importPlaylists(this.header);
        importPlaylistPositions(this);
        this.tuneSetPositionPlayInfos = importTuneSetPositionPlayInfos(this);
        this.initializePlaylists();
    }


    getTuneById(intTuneId:number) {
        for (let i = 0; i < this.tuneSets.length; i++) {
            for (let z = 0; z < this.tuneSets[i].tuneSetPositions.length; z++) {
                if (intTuneId == this.tuneSets[i].tuneSetPositions[z].tune.intTuneId) {
                    return this.tuneSets[i].tuneSetPositions[z].tune;
                }
            }
        }
        return null;
    }

    getTuneSetById(tuneSetId:number) {
        for (let i = 0; i < this.tuneSets.length; i++) {
            if (tuneSetId == this.tuneSets[i].tuneSetId) {
                return this.tuneSets[i];
            }
        }
        return null;
    }

    getPlaylistById(playlistId:number) {
        for (let i = 0; i < this.playlists.length; i++) {
            if (playlistId == this.playlists[i].id) {
                return this.playlists[i];
            }
        }
        return null;
    }

    getPlaylistPosition(playlistId:number, playlistPositionNr:number):PlaylistPosition {
        let playlist:Playlist;

        playlist = this.getPlaylistById(playlistId);

        return playlist.getPlaylistPosition(playlistPositionNr);
    }

    getPlaylistPositionByTuneSetId(playlistId:number, tuneSetId:number) {
        let playlist: Playlist;

        playlist = this.getPlaylistById(playlistId);

        return playlist.getPlaylistPositionByTuneSetId(tuneSetId);
    }

    getTuneSetsByIntTuneId(intTuneId:number):Array<TuneSet> {
        let tuneSets:Array<TuneSet> = [];

        for (let i = 0; i < this.tuneSets.length; i++) {
            for (let z = 0; z < this.tuneSets[i].tuneSetPositions.length; z++) {
                if (intTuneId == this.tuneSets[i].tuneSetPositions[z].tune.intTuneId) {
                    tuneSets.push(this.tuneSets[i]);
                }
            }
        }

        return tuneSets;
    }


    getPlaylistsByIntTuneId(intTuneId:number) {
        let tuneSets = this.getTuneSetsByIntTuneId(intTuneId);
        let playlists = [];
        let playlistSelected = false;

        for (let i = 0; i < tuneSets.length; i++) {
            for (let z = 0; z < this.playlists.length; z++) {
                for (let y = 0; y < this.playlists[z].playlistPositions.length; y++) {
                    if (this.playlists[z].playlistPositions[y].tuneSet == tuneSets[i]) {
                        playlistSelected = false;
                        for (let w = 0; w < playlists.length; w++) {
                            if (playlists[w] == this.playlists[z]) {
                                playlistSelected = true;
                            }
                        }
                        if (!playlistSelected) {
                            playlists.push(this.playlists[z]);
                        }
                    }
                }
            }
        }

        return playlists;
    }

    getPlaylistsByTuneSetId(tuneSetId:number) {
        let playlist, playlists, playlistAdded;
        playlists = [];

        for (let i = 0; i < this.playlists.length; i++) {
            playlist = this.playlists[i];
            playlistAdded = false;

            for (let z = 0; z < playlist.playlistPositions.length && !playlistAdded; z++) {
                if (playlist.playlistPositions[z].tuneSet.tuneSetId == tuneSetId) {
                    playlists.push(playlist);
                    playlistAdded = true;
                }
            }
        }

        return playlists;
    }

    getPlaylistPositionsByTuneSetId(tuneSetId: number) {
        let playlist: Playlist;
        let playlistPositions: Array<PlaylistPosition> = [];

        for (let i = 0; i < this.playlists.length; i++) {
            playlist = this.playlists[i];

            for (let z = 0; z < playlist.playlistPositions.length; z++) {
                if (playlist.playlistPositions[z].tuneSet.tuneSetId == tuneSetId) {
                    playlistPositions.push(playlist.playlistPositions[z]);
                }
            }
        }

        return playlistPositions;
    }

    writeAbc(abcExportSettings: AbcExportSettings): string {
        // Generate Abc
        let tbkAbc, tuneAbc, tunes;

        tunes = [];
        tuneAbc = "";
        tbkAbc = "";

        // Construct Header
        tbkAbc = writeAbcHeader(this, abcExportSettings);

        // Get Tunes
        tunes = this.getTunes();

        // Sort Tunes by intTuneId
        tunes.sort(function (a, b) {
            return a.intTuneId - b.intTuneId
        });

        for (let i = 0; i < tunes.length; i++) {
            tuneAbc = writeTuneAbc(tunes[i], this.getTuneSetPositionsByIntTuneId(tunes[i].intTuneId), abcExportSettings);
            tbkAbc += tuneAbc;
            tbkAbc += "\n";	//empty line between tunes
        }

        return tbkAbc;
    }

    getTunes(): Array<Tune> {
        // Extract Tunes form TuneSets.

        return extractTunes(this.tuneSets);
    }

    getTuneSetPositionsByIntTuneId(intTuneId:number) {
        let tuneSetPositions = [];

        for (let i = 0; i < this.tuneSets.length; i++) {
            for (let z = 0; z < this.tuneSets[i].tuneSetPositions.length; z++) {
                if (intTuneId == this.tuneSets[i].tuneSetPositions[z].tune.intTuneId) {
                    tuneSetPositions.push(this.tuneSets[i].tuneSetPositions[z]);
                }
            }
        }

        return tuneSetPositions;
    }

    copyPlaylist(playlistIdOriginal): number {
        let playlistId: number;
        let playlistName: string;
        let playlistOriginal: Playlist;
        let playlistCopy: Playlist;

        playlistOriginal = this.getPlaylistById(playlistIdOriginal);

        playlistId = this._getNextPlaylistId();
        playlistName = 'Copy of ' + playlistOriginal.name;

        playlistCopy = new Playlist(playlistId, playlistName, playlistOriginal.event, playlistOriginal.band);
        this.playlists.push(playlistCopy);

        this._copyPlaylistPositions(playlistOriginal, playlistCopy);

        return playlistId;
    }

    _getNextPlaylistId(): number {
        let nextPlaylistId: number;
        let currentPlaylistId: number;
        let maxPlaylistId: number;

        maxPlaylistId = 0;

        for (let i = 0; i < this.playlists.length; i++) {
            //TODO: Obwohl Playlist.id als number definiert, ist an dieser Stelle ein String drin! 
            //currentPlaylistId = parseInt(this.playlists[i].id);
            currentPlaylistId = this.playlists[i].id;
            if (currentPlaylistId > maxPlaylistId) {
                maxPlaylistId = currentPlaylistId;
            }
        }


        nextPlaylistId = maxPlaylistId + 1;
        return nextPlaylistId;
    }

    copyPlaylistPositions(playlistOriginal, playlistCopy) {
        let playlistPositionOriginal, playlistPositionCopy;

        for (let y = 0; y < playlistOriginal.playlistPositions.length; y++) {
            playlistPositionOriginal = playlistOriginal.playlistPositions[y];

            this._copyPlaylistPositionAndTuneSetPlayInfos(playlistPositionOriginal, playlistCopy, playlistPositionOriginal.position);
        }
    }

    copyPlaylistPositionAndTuneSetPlayInfos(playlistPositionOriginal: PlaylistPosition, targetPlaylist, targetPlaylistPositionNr) {
        let playlistPositionCopy: PlaylistPosition;

        // Generate PlaylistPosition
        playlistPositionCopy = new PlaylistPosition(targetPlaylist.id, targetPlaylistPositionNr, playlistPositionOriginal.tuneSet, playlistPositionOriginal.name, playlistPositionOriginal.annotation);

        // Add PlaylistPosition to Playlist
        targetPlaylist.addPlaylistPosition(playlistPositionCopy);

        // Copy TuneSetPositionPlayInfos
        this._copyTuneSetPositionPlayInfos(playlistPositionOriginal, playlistPositionCopy);
    }

    copyTuneSetPositionPlayInfos(playlistPositionOriginal: PlaylistPosition, playlistPositionCopy: PlaylistPosition) {
        let tuneSetPositionPlayInfoOriginal: TuneSetPositionPlayInfo;
        let tuneSetPositionPlayInfoCopy: TuneSetPositionPlayInfo;
        let partPlayInfosCopy: PartPlayInfo;

        for (let y = 0; y < playlistPositionOriginal.tuneSetPositionPlayInfos.length; y++) {
            tuneSetPositionPlayInfoOriginal = playlistPositionOriginal.tuneSetPositionPlayInfos[y];

            // Copy partPlayInfos
            partPlayInfosCopy = this._copyPartPlayInfos(tuneSetPositionPlayInfoOriginal);

            // Generate tuneSetPositionPlayInfo
            tuneSetPositionPlayInfoCopy = new TuneSetPositionPlayInfo(playlistPositionCopy, tuneSetPositionPlayInfoOriginal.tuneSetPosition, tuneSetPositionPlayInfoOriginal.repeat, partPlayInfosCopy, tuneSetPositionPlayInfoOriginal.annotation);

            // Copy TuneSetPositionPlayInfos
            playlistPositionCopy.addTuneSetPositionPlayInfo(tuneSetPositionPlayInfoCopy);

            this.tuneSetPositionPlayInfos.push(tuneSetPositionPlayInfoCopy);
        }
    }

    getTuneSetPositionPlayInfosForPlaylistPosition(playlistPosition) {
        let tuneSetPositionPlayInfos, tuneSetPositionPlayInfo;

        tuneSetPositionPlayInfos = [];

        for (let z = 0; z < this.tuneSetPositionPlayInfos.length; z++) {
            if (this.tuneSetPositionPlayInfos[z].playlistPosition == playlistPosition) {
                tuneSetPositionPlayInfo = this.tuneSetPositionPlayInfos[z];
                tuneSetPositionPlayInfos.push(tuneSetPositionPlayInfo);
            }
        }

        return tuneSetPositionPlayInfos;
    }

    copyPartPlayInfos(tuneSetPositionPlayInfoOriginal) {
        let partPlayInfosOriginal, partPlayInfosCopy,
            partPlayInfoOriginal, partPlayInfoCopy;

        partPlayInfosCopy = [];

        for (let y = 0; y < tuneSetPositionPlayInfoOriginal.partPlayInfos.length; y++) {
            partPlayInfoOriginal = tuneSetPositionPlayInfoOriginal.partPlayInfos[y];

            // Generate partPlayInfo
            partPlayInfoCopy = new PartPlayInfo(partPlayInfoOriginal.part, partPlayInfoOriginal.playInfo);
            partPlayInfosCopy.push(partPlayInfoCopy);
        }

        return partPlayInfosCopy;
    }

    copyPlaylistPositionToOtherPlaylist(sourcePlaylistId, sourcePlaylistPositionNr, targetPlaylistId) {
        let playlistPosition, targetPlaylist, targetPlaylistPositionNr;

        playlistPosition = this.getPlaylistPosition(sourcePlaylistId, sourcePlaylistPositionNr);
        targetPlaylist = this.getPlaylistById(targetPlaylistId);
        // Am Schluss einfügen
        targetPlaylistPositionNr = targetPlaylist.playlistPositions.length + 1;

        this._copyPlaylistPositionAndTuneSetPlayInfos(playlistPosition, targetPlaylist, targetPlaylistPositionNr);
    }

    moveTuneSetPositionOneSetInvolved(tuneSetId: number, oldPosition: number, newPosition: number) {
        this.getTuneSetById(tuneSetId).moveTuneSetPosition(oldPosition, newPosition);
    }

    moveTuneSetPositionTwoSetsInvolved(sourceTuneSetId: number, sourcePosition: number,
        targetTuneSetId: number, targetPosition: number, beforeOrAfter: string, moveOrCopy: string): boolean {
        // Moving or Copying a TuneSetPosition
        let sourceTuneSet = this.getTuneSetById(sourceTuneSetId);
        let sourceTuneSetPosition: TuneSetPosition = null;
        let targetTuneSet: TuneSet = null;
        let tuneSetDeleted: boolean = false;
        let removedPosition: number = sourcePosition;

        for (let z = 0; z < sourceTuneSet.tuneSetPositions.length; z++) {
            if (sourceTuneSet.tuneSetPositions[z].position == sourcePosition) {
                sourceTuneSetPosition = sourceTuneSet.tuneSetPositions[z];
            }
        }

        if (targetTuneSetId == null) {
            // Copy or Move TuneSetPosition to a new Set
            this._initializeTuneSet(sourceTuneSetPosition.tune);

        } else {
            targetTuneSet = this.getTuneSetById(targetTuneSetId);
        }


        // Handle Source TuneSet
        if (moveOrCopy == "move") {

            // Remove TuneSetPosition from Source TuneSet
            for (let z = 0; z < sourceTuneSet.tuneSetPositions.length; z++) {
                if (sourceTuneSet.tuneSetPositions[z].position == sourcePosition) {
                    // Delete TuneSetPosition from TuneSet
                    sourceTuneSet.tuneSetPositions.splice(z, 1);
                }
            }

            if (sourceTuneSet.tuneSetPositions.length == 0) {
                // Empty TuneSet
                // Remove TuneSet from the List
                this.tuneSets.splice(this.tuneSets.indexOf(sourceTuneSet), 1);
                tuneSetDeleted = true;

            } else {
                // TuneSet still has TuneSetPositions
                // Adjust Positions of remaining TuneSetPositions:
                // Only necessary for tunes that come after the removed tune
                let currentPosition = 0;

                for (let y = 0; y < sourceTuneSet.tuneSetPositions.length; y++) {
                    currentPosition = sourceTuneSet.tuneSetPositions[y].position;

                    if (currentPosition > removedPosition) {
                        currentPosition--;
                        // Change Position on TuneSetPosition
                        sourceTuneSet.tuneSetPositions[y].position = currentPosition;
                    }
                }
            }
        }

        // Handle Target TuneSet
        if (targetTuneSetId != null) {
            let newPosition = 0;
            newPosition = targetPosition;

            if (beforeOrAfter == "after") {
                newPosition++;
            }

            let targetTuneSetPosition: TuneSetPosition;

            if (moveOrCopy == "move") {
                // Set new TuneSetId and Position on TuneSetPosition
                // copy by reference
                targetTuneSetPosition = sourceTuneSetPosition;
                targetTuneSetPosition.tuneSetId = targetTuneSetId;
                targetTuneSetPosition.position = newPosition;

            } else if (moveOrCopy == "copy") {
                // Set new TuneSetId and Position on TuneSetPosition
                // copy by value (primitive types), copy by reference (objects) -> tune is shared
                targetTuneSetPosition = new TuneSetPosition(targetTuneSetId, sourceTuneSetPosition.tune, newPosition.toString(), sourceTuneSetPosition.repeat, sourceTuneSetPosition.annotation);
            }

            // Add TuneSetPosition to TuneSet (only if source tuneSet ist different from target tuneSet)
            // At index (newPosition--) insert the moving TuneSetPosition, but don't remove other TuneSetPositions
            let insertAt = newPosition - 1;
            targetTuneSet.tuneSetPositions.splice(insertAt, 0, targetTuneSetPosition);

            // Change Position of other TuneSetPositions in the Targe-Set:
            // Only necessary for tunes that come after the inserted tune
            for (let y = 0; y < targetTuneSet.tuneSetPositions.length; y++) {

                let currentPosition = 0;

                if (targetTuneSet.tuneSetPositions[y] == targetTuneSetPosition) {
                    // TuneSetPosition which was moved: Already Done

                } else {
                    // TuneSetPositions which were not moved
                    currentPosition = targetTuneSet.tuneSetPositions[y].position;

                    if (currentPosition >= newPosition) {
                        currentPosition++;
                        // Change Position on TuneSetPosition
                        targetTuneSet.tuneSetPositions[y].position = currentPosition;
                    }
                }
            }
        }

        return tuneSetDeleted;
    }


    moveTuneSetPosition(sourceTuneSetId: number, sourcePosition: number,
        targetTuneSetId: number, targetPosition: number, beforeOrAfter: string, moveOrCopy: string): boolean {

        if (targetTuneSetId == null || sourceTuneSetId !== targetTuneSetId) {
            return this.moveTuneSetPositionTwoSetsInvolved(sourceTuneSetId, sourcePosition,
                targetTuneSetId, targetPosition, beforeOrAfter, moveOrCopy);
        } else {
            this.moveTuneSetPositionOneSetInvolved(sourceTuneSetId, sourcePosition, targetPosition);
            return false;
        }
    }

    movePlaylistPosition(playlistId: number, oldPosition: number, newPosition: number) {
        let playlist: Playlist;

        playlist = this.getPlaylistById(playlistId);

        playlist.movePlaylistPosition(oldPosition, newPosition);

        return playlist;
    }

    initializeTuneSet(intTuneId) {
        return this._initializeTuneSet(this.getTuneById(intTuneId));
    }

    _initializeTuneSet(tune) {
        // Get next tuneSetId
        let nextTuneSetId = this.getNextTuneSetId();
        let tuneSet: TuneSet;
        let tuneSetPositions = [];
        let tuneSetPosition = new TuneSetPosition(nextTuneSetId, tune, 1, "3x", "");
        //addNewTuneSetDirective(tuneSetPosition);
        tuneSetPositions.push(tuneSetPosition);
        tuneSet = new TuneSet(nextTuneSetId, tune.title, tuneSetPositions);

        this.tuneSets.unshift(tuneSet);


        return tuneSet;
    }

    getNextTuneSetId() {
        let nextTuneSetId, currentTuneSetId, maxTuneSetId;

        maxTuneSetId = 0;

        for (let i = 0; i < this.tuneSets.length; i++) {
            //currentTuneSetId = parseInt(this.tuneSets[i].tuneSetId);
            currentTuneSetId = this.tuneSets[i].tuneSetId;
            if (currentTuneSetId > maxTuneSetId) {
                maxTuneSetId = currentTuneSetId;
            }
        }

        nextTuneSetId = maxTuneSetId + 1;
        return nextTuneSetId;
    }

    deletePlaylistPosition(playlistId, position) {
        let playlist = this.getPlaylistById(playlistId);

        playlist.deletePlaylistPosition(position);
    }

    deletePlaylist(playlistId) {
        let playlist = this.getPlaylistById(playlistId);

        for (let z = 0; z < this.playlists.length; z++) {
            if (this.playlists[z].id == playlistId) {
                // Delete all playlistPositions
                // nicht nötig, da beim Export die Playlist der Trigger ist

                // Delete playlist
                this.playlists.splice(z, 1);
            }
        }
    }

    deleteTuneSetPosition(tuneSetId, position) {
        // Deleting a TuneSetPosition: The Tune can end up set-less -> in this case a new set is generated.
        let tuneSet, tuneSetPosition, playlistPositions, tuneSetPositionPlayInfo, tuneSetDeleted, removedPosition;

        tuneSet = this.getTuneSetById(tuneSetId);
        tuneSetPosition = null;
        playlistPositions = [];
        tuneSetDeleted = false;
        removedPosition = 0;
        removedPosition = parseInt(position);

        for (let z = 0; z < tuneSet.tuneSetPositions.length; z++) {
            if (tuneSet.tuneSetPositions[z].position == position) {
                tuneSetPosition = tuneSet.tuneSetPositions[z];
                // Delete TuneSetPosition from TuneSet
                tuneSet.tuneSetPositions.splice(z, 1);
            }
        }

        if (this.getTuneSetsByIntTuneId(tuneSetPosition.tune.intTuneId).length == 0) {
            //A Tune always has to be within a set. Since the last TuneSetPosition was deleted,
            //a new Set has to be created
            this._initializeTuneSet(tuneSetPosition.tune);
        }

        if (tuneSet.tuneSetPositions.length == 0) {
            // Empty TuneSet
            // Remove TuneSet from the List
            this.tuneSets.splice(this.tuneSets.indexOf(tuneSet), 1);
            tuneSetDeleted = true;

        } else {
            // TuneSet still has TuneSetPositions
            // Adjust Positions of remaining TuneSetPositions: Only necessary for tunes that come after the removed tune
            let currentPosition = 0;

            for (let y = 0; y < tuneSet.tuneSetPositions.length; y++) {
                currentPosition = parseInt(tuneSet.tuneSetPositions[y].position);

                if (currentPosition > removedPosition) {
                    currentPosition--;
                    // Change Position on TuneSetPosition
                    tuneSet.tuneSetPositions[y].position = currentPosition.toString();
                }
            }
        }


        // Get all PlaylistPositions for this TuneSet
        playlistPositions = this.getPlaylistPositionsByTuneSetId(tuneSet.tuneSetId);

        for (let w = 0; w < playlistPositions.length; w++) {
            tuneSetPositionPlayInfo = this.getTuneSetPositionPlayInfo(playlistPositions[w], tuneSetPosition);
            // Remove TuneSetPositionPlayInfo from the List
            this.tuneSetPositionPlayInfos.splice(this.tuneSetPositionPlayInfos.indexOf(tuneSetPositionPlayInfo), 1);

            if (tuneSetDeleted) {
                // Delete PlaylistPositions
                this.deletePlaylistPosition(playlistPositions[w].playlistId, playlistPositions[w].position);
            }


        }

        return tuneSetDeleted;
    }

    initializePlaylists() {
        for (let i = 0; i < this.playlists.length; i++) {
            this.initializeTuneSetPositionPlayInfos(this.playlists[i]);
        }
    }

    initializeTuneSetPositionPlayInfosForPlaylistPosition(playlistPosition: PlaylistPosition) {

        // Für ein Set, dass in einer Playlist nicht von seinen Default-Werten abweicht, existiert kein TuneSetPositionPlayInfo im Abc-File.
        // Die Applikation braucht aber auch Default-TuneSetPositionPlayInfos. Diese werden in dieser Methode generiert.
        // Ausserdem werden seit eTuneBook V2 in dieser Methode die für eine PlaylistPosition relevanten TuneSetPositionPlayInfos angehängt. 
        // Hinweis: 
        // -Die Default-Werte (repeat und annotation auf der TuneSetPosition) können seit eTuneBook V2 nicht mehr auf der TuneSetPosition editiert werden. 
        // -Aus Gründen den Rückwärts-Kompatibiltät wurde der Mechanismus der Default-Werte im Modell jedoch belassen.
        // -Vorteil dieses Systems: Es braucht nicht für jede TuneSetPositionPlayInfo eine Zeile im ABC-File.

        let tuneSet: TuneSet;
        let tuneSetPosition: TuneSetPosition;
        let tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;
        let partPlayInfos: Array<PartPlayInfo>;

        tuneSet = playlistPosition.tuneSet;

        for (let z = 0; z < tuneSet.tuneSetPositions.length; z++) {
            tuneSetPositionPlayInfo = undefined;
            tuneSetPosition = tuneSet.tuneSetPositions[z];
            tuneSetPositionPlayInfo = this.getTuneSetPositionPlayInfo(playlistPosition, tuneSetPosition);

            if (tuneSetPositionPlayInfo == undefined) {
                // Default-PlayInfos
                partPlayInfos = [];
                tuneSetPositionPlayInfo = new TuneSetPositionPlayInfo(playlistPosition, tuneSetPosition, tuneSetPosition.repeat, partPlayInfos, tuneSetPosition.annotation);
                this.tuneSetPositionPlayInfos.push(tuneSetPositionPlayInfo);
            }

            // Attach TuneSetPositionPlayInfo to PlaylistPosition
            playlistPosition.addTuneSetPositionPlayInfo(tuneSetPositionPlayInfo);

            // Attach TuneSetPositionPlayInfo to TuneSetPosition
            tuneSetPosition.addTuneSetPositionPlayInfo(tuneSetPositionPlayInfo);
        }
    }

    initializeTuneSetPositionPlayInfos(playlist: Playlist) {
        for (let i = 0; i < playlist.playlistPositions.length; i++) {
            this.initializeTuneSetPositionPlayInfosForPlaylistPosition(playlist.playlistPositions[i]);
        }
    }

    initializeTuneSetPositionPlayInfosForPlaylist(playlistId: number) {
        this.initializeTuneSetPositionPlayInfos(this.getPlaylistById(playlistId));
    }

    getPlaylistPositionsByIntTuneId(playlistId:number, intTuneId:number) {
        let playlistPositions = [];
        let tuneSets = this.getTuneSetsByIntTuneId(intTuneId);
        let playlist = this.getPlaylistById(playlistId);

        for (let i = 0; i < tuneSets.length; i++) {
            for (let y = 0; y < playlist.playlistPositions.length; y++) {
                if (playlist.playlistPositions[y].tuneSet == tuneSets[i]) {
                    playlistPositions.push(playlist.playlistPositions[y]);
                }
            }
        }

        return playlistPositions;
    }

    getTuneSetPositionsForTuneSetId(tuneSetId:number, tuneSetPositions) {
        // Extract TuneSetPositions from TuneSets.
        for (let i = 0; i < this.tuneSets.length; i++) {
            for (let z = 0; z < this.tuneSets[i].tuneSetPositions.length; z++) {
                if (tuneSetId == this.tuneSets[i].tuneSetPositions[z].tuneSetId) {
                    tuneSetPositions.push(this.tuneSets[i].tuneSetPositions[z]);
                }
            }
        }

        return tuneSetPositions;
    }

    getTuneSetPositions() {
        // Extract TuneSetPositions from TuneSets.

        return extractTuneSetPositions(this.tuneSets);
    }

    addVideo(intTuneId:number, videoSource:string, videoCode:string, videoDescription:string) {
        let tune:Tune = this.getTuneById(intTuneId);
        
        if (tune != null) {
            return tune.addVideo(videoSource, videoCode, videoDescription);
        } 
        return null;
    }

    addWebsite(intTuneId:number, url:string) {
        let tune:Tune = this.getTuneById(intTuneId);
        
        if (tune != null) {
            return tune.addWebsite(url);
        }
        return null;
    }

    getVideoById(intTuneId:number, videoSource:string, videoCode:string) {
        let tune = this.getTuneById(intTuneId);
        
        if (tune != null) {
            return tune.getVideoById(videoSource, videoCode);
        }
        return null;
    }

    deleteVideo(intTuneId:number, videoSource:string, videoCode:string) {
        let tune: Tune = this.getTuneById(intTuneId);
        
        if (tune != null) {
            tune.deleteVideo(videoSource, videoCode);
        }
    }

    deleteWebsite(intTuneId:number, url:string) {
        let tune: Tune = this.getTuneById(intTuneId);
        
        if (tune != null) {
            tune.deleteWebsite(url);
        }
    }

    deleteTuneSet(tuneSet: TuneSet) {
        // Remove TuneSet from the List of TuneSets
        // TuneSet will be deleted later by Garbage Collector
        this.tuneSets.splice(this.tuneSets.indexOf(tuneSet), 1);
        
        //TODO:Delete PlaylistPositons of deleted tuneSet 
    }

    deleteTuneFromSets(intTuneId: number) {
        let tuneSets: Array<TuneSet> = [];
        let tuneSet: TuneSet;
       
        tuneSets = this.getTuneSetsByIntTuneId(intTuneId);

        for (let i = 0; i < tuneSets.length; i++) {
            tuneSet = tuneSets[i];

            tuneSet.deleteTune(intTuneId);

            if (tuneSet.tuneSetPositions.length == 0) {
                // Empty TuneSet
                this.deleteTuneSet(tuneSet);
            }
        }
    }
    
    deleteTuneFromPlaylists(intTuneId: number) {
        let playlists: Array<Playlist> = [];
        let playlist:Playlist;

        playlists = this.getPlaylistsByIntTuneId(intTuneId);

        for (let z = 0; z < playlists.length; z++) {
            playlist = playlists[z];
            
            playlist.deleteTune(intTuneId);
        }

    }

    deleteTune(intTuneId: number) {
        this.deleteTuneFromSets(intTuneId);
        this.deleteTuneFromPlaylists(intTuneId);
    }

    addPlaylistPositions(playlistId: number, setIds: Array<number>) {
        // Add a Default-PlaylistPosition to the playlist for each of the selected Sets
        // Add a Default-TuneSetPositionPlayInfo for each of the TuneSetPositions of the selected Sets
        let playlist: Playlist;
        let tuneSet: TuneSet;
        let playlistPosition: PlaylistPosition;

        playlist = this.getPlaylistById(playlistId);

        for (let z = 0; z < setIds.length; z++) {
            tuneSet = this.getTuneSetById(setIds[z]);
            playlistPosition = new PlaylistPosition(playlist.id, playlist.playlistPositions.length + 1, tuneSet, "", "");
            this.initializeTuneSetPositionPlayInfosForPlaylistPosition(playlistPosition);
            playlist.playlistPositions.push(playlistPosition);
        }
    }

    addEmptyPlaylistPosition(playlistId): PlaylistPosition {
        let playlist, emptyPlaylistPosition;

        playlist = this.getPlaylistById(playlistId);
        emptyPlaylistPosition = new PlaylistPosition(playlist.id, playlist.playlistPositions.length + 1, null, "", "");
        playlist.playlistPositions.push(emptyPlaylistPosition);

        return emptyPlaylistPosition;
    }

    addEmptyPlaylist() {
        let emptyPlaylist;

        emptyPlaylist = new Playlist(this._getNextPlaylistId(), "New Playlist", "Event Type", "Band Name");
        this.playlists.push(emptyPlaylist);

        return emptyPlaylist;
    }

    getTuneSetPositionPlayInfo(playlistPosition, tuneSetPosition) {
        let tuneSetPositionPlayInfo;

        tuneSetPositionPlayInfo = undefined;

        for (let z = 0; z < this.tuneSetPositionPlayInfos.length; z++) {
            if (this.tuneSetPositionPlayInfos[z].playlistPosition == playlistPosition
                && this.tuneSetPositionPlayInfos[z].tuneSetPosition == tuneSetPosition) {
                tuneSetPositionPlayInfo = this.tuneSetPositionPlayInfos[z];
            }
        }

        return tuneSetPositionPlayInfo;
    }

    initializePartPlayInfo() {
        return new PartPlayInfo("", "");
    }

    initializeTuneAndTuneSet() {
        // Get next tuneSetId, intTuneId and tuneId
        let maxTuneSetId = 0;
        let maxIntTuneId = 0;
        let maxTuneId = 0;
        let currentTuneId = 0;
        let currentIntTuneId = 0;
        let currentTuneSetId = 0;

        for (let i = 0; i < this.tuneSets.length; i++) {

            //currentTuneSetId = parseInt(this.tuneSets[i].tuneSetId);
            currentTuneSetId = this.tuneSets[i].tuneSetId;
            if (currentTuneSetId > maxTuneSetId) {
                maxTuneSetId = currentTuneSetId;
            }

            for (let z = 0; z < this.tuneSets[i].tuneSetPositions.length; z++) {

                //currentIntTuneId = parseInt(this.tuneSets[i].tuneSetPositions[z].tune.intTuneId);
                currentIntTuneId = this.tuneSets[i].tuneSetPositions[z].tune.intTuneId;
                if (currentIntTuneId > maxIntTuneId) {
                    maxIntTuneId = currentIntTuneId;
                }

                //currentTuneId = parseInt(this.tuneSets[i].tuneSetPositions[z].tune.id);
                currentTuneId = this.tuneSets[i].tuneSetPositions[z].tune.intTuneId;
                if (currentTuneId > maxTuneId) {
                    maxTuneId = currentTuneId;
                }
            }
        }

        // Create new Tune with X: maxTuneId + 1 and T: New Tune
        let newTuneId = ++maxTuneId;
        let newTuneSetId = ++maxTuneSetId;
        let newIntTuneId = ++maxIntTuneId;

        let abc = "X:" + newTuneId + "\n" + "T:New Tune";
        let book = new ABCJS.TuneBook(abc);
        let tune: Tune = new Tune(book.tunes[0], newIntTuneId);

        let tuneSet: TuneSet;
        let tuneSetPositions:Array<TuneSetPosition> = [];
        let tuneSetPosition = new TuneSetPosition(newTuneSetId, tune, 1, "3x", "");
        tuneSetPositions.push(tuneSetPosition);
        tuneSet = new TuneSet(newTuneSetId, tune.title, tuneSetPositions);

        this.tuneSets.unshift(tuneSet);


        return tuneSet;
    }

    getTuneTypes(): Array<string> {
        //Extract Types for TypeFilter
        let types: Array<string> = [];
        let addToTypeFilter = true;

        for (let i = 0; i < this.tuneSets.length; i++) {
            for (let c = 0; c < this.tuneSets[i].tuneSetPositions.length; c++) {
                addToTypeFilter = true;

                for (let z = 0; z < types.length; z++) {
                    if (types[z] == this.tuneSets[i].tuneSetPositions[c].tune.type) {
                        addToTypeFilter = false;
                    }
                }

                if (addToTypeFilter) {
                    types.push(this.tuneSets[i].tuneSetPositions[c].tune.type);
                }
            }
        }

        types.unshift("All Types");

        return types;
    }

    getKeys(): Array<string> {
        //Extract Keys for KeyFilter
        let keys:Array<string> = [];
        let addToKeyFilter = true;

        for (let i = 0; i < this.tuneSets.length; i++) {
            for (let c = 0; c < this.tuneSets[i].tuneSetPositions.length; c++) {
                addToKeyFilter = true;

                for (let z = 0; z < keys.length; z++) {
                    if (keys[z] == this.tuneSets[i].tuneSetPositions[c].tune.key) {
                        addToKeyFilter = false;
                    }
                }

                if (addToKeyFilter) {
                    keys.push(this.tuneSets[i].tuneSetPositions[c].tune.key);
                }
            }
        }

        keys.unshift("All Keys");

        return keys;
    }

    getEvents(): Array<string> {
        //Extract Events for EventFilter
        let events:Array<string> = [];
        let addToEventFilter = true;

        for (let i = 0; i < this.playlists.length; i++) {
            addToEventFilter = true;

            for (let z = 0; z < events.length; z++) {
                if (events[z] == this.playlists[i].event) {
                    addToEventFilter = false;
                }
            }

            if (this.playlists[i].event != 'undefined' && this.playlists[i].event != '' && addToEventFilter) {
                events.push(this.playlists[i].event);
            }

        }

        events.unshift("All Events");

        return events;
    }

    getBands(): Array<string> {
        //Extract Bands for BandFilter
        let bands:Array<string> = [];
        let addToBandFilter = true;

        for (let i = 0; i < this.playlists.length; i++) {
            addToBandFilter = true;

            for (let z = 0; z < bands.length; z++) {
                if (bands[z] == this.playlists[i].band) {
                    addToBandFilter = false;
                }
            }

            if (this.playlists[i].band != 'undefined' && this.playlists[i].band != '' && addToBandFilter) {
                bands.push(this.playlists[i].band);
            }
        }

        bands.unshift("All Bands");

        return bands;
    }

    getColors(): Array<string> {
        //Extract Colors for ColorFilter
        let colors:Array<string> = [];
        let addToColorFilter = true;

        for (let i = 0; i < this.tuneSets.length; i++) {
            for (let c = 0; c < this.tuneSets[i].tuneSetPositions.length; c++) {
                addToColorFilter = true;

                for (let z = 0; z < colors.length; z++) {
                    if (colors[z] == this.tuneSets[i].tuneSetPositions[c].tune.color.getHexValue()) {
                        addToColorFilter = false;
                    }
                }

                if (addToColorFilter) {
                    colors.push(this.tuneSets[i].tuneSetPositions[c].tune.color.getHexValue());
                }
            }
        }

        colors.unshift("All Colors");

        return colors;
    }


}
