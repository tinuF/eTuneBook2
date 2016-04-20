import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
import {TuneBook} from '../business/model/tunebook';
import {Tune} from '../business/model/tune';
import {TuneSet} from '../business/model/tuneset';
import {AbcExportSettings} from '../common/settings/abc-export-settings';
import {FilterSettings} from '../common/settings/filter-settings';
import {PlaylistSettings} from '../common/settings/playlist-settings';
import {tuneUp, tuneDown} from '../business/util/transposer-util';
import {filterTunes, filterTuneSets, extractTunes, filterPlaylists} from '../business/filter/filter-logic';
import {getRandomArrayIndex, shuffleArray} from '../business/util/math-util';
import {getSystemProperties} from '../common/system-properties';

@Injectable()
export class TuneBookService {
    tuneBook: TuneBook;
    tunesFiltered: Array<Tune>;
    tuneSetsFiltered: Array<TuneSet>;
    systemProperties:any;
    abcExportSettings: AbcExportSettings;
    filterSettings: FilterSettings;
    playlistSettings: PlaylistSettings;
    editModus: boolean;

    constructor(public http: Http) {
        this.systemProperties = getSystemProperties();
        this.tuneBook = this.getCurrentTuneBook();
        this.abcExportSettings = new AbcExportSettings();
        this.initializeFilter();
        this.editModus = false;
        this.playlistSettings = new PlaylistSettings();
    }

    setCurrentTuneBook(abc:string) {
        this.tuneBook = new TuneBook(abc);
        this.initializeFilter();
    }

    getCurrentTuneBook() {
        if (this.tuneBook == null) {
            return this.getTuneBookFromLocalStorage();
        }
        return this.tuneBook;
    }

    getCurrentFilterSettings() {
        return this.filterSettings;
    }

    getCurrentPlaylistSettings() {
        return this.playlistSettings;
    }

    isEditModus() {
        return this.editModus;
    }

    toggleEditModus(): boolean {
        this.editModus = !this.editModus;
        return this.editModus;
    }

    initializeFilter() {
        this.filterSettings = new FilterSettings();
        this.setTunesFiltered();
    }

    getTuneBookFromLocalStorage() {
        // Retrieve eTuneBook Abc from localStorage
        var abc = JSON.parse(localStorage.getItem(this.systemProperties.STORAGE_ID_TUNEBOOK) || '[]');

        if (abc == undefined || abc == "") {
            this.tuneBook = null;
        } else {
            //Convert eTuneBook Abc to eTuneBook-Model
            this.setCurrentTuneBook(abc);
        }
        return this.tuneBook;
    }

    getTuneBookFromImportedFile(abc:string, fileName:string) {
        this.setCurrentTuneBook(abc);
        if (this.tuneBook.name == "") {
            this.tuneBook.name = fileName;
        }
        return this.tuneBook;
    }

    getDefaultFromServer() {
        this.http.get(this.systemProperties.EXAMPLE_FILENAME)
            .map(res => res.text())
            .subscribe(data => {
                this.setCurrentTuneBook(data);
                this.storeTuneBookAbc();
            });
    }

    storeTuneBookAbc() {
        // Generate TuneBook Abc from the current TuneBook and store it in localStorage
        localStorage.setItem(this.systemProperties.STORAGE_ID_TUNEBOOK, JSON.stringify(this.writeAbc(new AbcExportSettings())));
    }
/*
    storeSettings(settings) {
        // Store settings in localStorage
        // currently not used. check possible usage for AbcExportSettings, FilterSettings
        localStorage.setItem(this.systemProperties.STORAGE_ID_SETTINGS, JSON.stringify(settings));
    }
*/
    writeAbc(abcExportSettings: AbcExportSettings) {
        return this.getCurrentTuneBook().writeAbc(this.getAbcExportSettings());
    }

    getAbcExportSettings(): AbcExportSettings {
        return this.abcExportSettings;
    }

    getSampleAbc(intTuneId: number, startFromBar: number, numberOfBars: number) {
        var tune = this.getTune(intTuneId);
        return tune.getSampleAbc(startFromBar, numberOfBars);
    }

    tuneUp(intTuneId:number) {
        var tune = this.getTune(intTuneId);
        // Transpose up and Sync Tune-Key
        tune.key = this.getTuneKey(tuneUp(tune));
    }

    tuneDown(intTuneId:number) {
        var tune = this.getTune(intTuneId);
        // Transpose down and Sync Tune-Key
        tune.key = this.getTuneKey(tuneDown(tune));
    }

    initializeTuneSet(intTuneId:number) {
        this.getCurrentTuneBook().initializeTuneSet(intTuneId);
        this.initializeFilter();
    }

    initializePartPlayInfo() {
        return this.getCurrentTuneBook().initializePartPlayInfo();
    }

    initializeTuneAndTuneSet(): TuneSet {
        if (this.getCurrentTuneBook() == null) {
            this.tuneBook = this.initializeTuneBook();
            this.initializeFilter();
            return this.tuneBook.tuneSets[0];

        } else {
            let set: TuneSet = this.getCurrentTuneBook().initializeTuneAndTuneSet();
            this.initializeFilter();
            return set;
        }

    }

    getTuneKey(tune:Tune) {
        return tune.getTuneKey();
    }

    getTuneTitle(tune:Tune) {
        return tune.getTuneTitle();
    }

    getTuneType(tune:Tune) {
        return tune.getTuneType();
    }

    getTuneId(tune:Tune) {
        return tune.getTuneId();
    }

    addTunePlayDate(tune:Tune, newDate:Date) {
        tune.addPlayDate(newDate);
    }

    addTuneSetPlayDate(tuneSet:TuneSet, newDate:Date) {
        tuneSet.addPlayDate(newDate);
    }
    /* TODO: remove
        setRandomSort(tuneBook) {
            this._setRandomSort(tuneBook);
        }
    */
    initializeTuneBook() {
        this.setCurrentTuneBook(this.getAbcforNewTuneBook());
        //TODO: Check if necessary and refactor
        //this.tuneBook.tuneSets[0].tuneSetPositions[0].tune.intTuneId = 1;
        return this.tuneBook;
    }
/*
    getSettingsFromStore() {
        var settings = [];

        // Retrieve Settings from localStorage
        // TODO: Store AbcExportSettings and FilterSettings?
        settings = JSON.parse(localStorage.getItem(this.systemProperties.STORAGE_ID_SETTINGS) || '[]');

        return settings;
    }
*/
    moveTuneSetPosition(sourceTuneSetId:number, sourcePosition:number, 
                        targetTuneSetId:number, targetPosition:number, 
                        beforeOrAfter:string, moveOrCopy:string):boolean {
        
        let tuneSetDeleted: boolean = this.getCurrentTuneBook().moveTuneSetPosition(sourceTuneSetId, sourcePosition,
            targetTuneSetId, targetPosition, beforeOrAfter, moveOrCopy);
        this.setTunesFiltered();
        //this.setTunesFiltered() wird gebraucht, damit bei Löschung eines Sets die Liste aktualisiert wird
        //(die Screens reagieren auf tunesFiltered und tuneSetsFiltered)
        //Problem: Beim Aktualisieren der Liste geht die Sortierung der Sets verloren. 
        //Die Sortierung wird im set-list-menu via toggle gesetzt, aber nicht in FilterSettings gespeichert.
        //TODO: SortierungSettings
        return tuneSetDeleted;
    }

    movePlaylistPosition(playlistId:number, oldPosition:number, newPosition:number) {
        return this.getCurrentTuneBook().movePlaylistPosition(playlistId, oldPosition, newPosition);
    }

    addEmptyPlaylistPosition(playlistId:number) {
        return this.getCurrentTuneBook().addEmptyPlaylistPosition(playlistId);
    }

    addPlaylistPositions(playlistId:number, setIds:Array<number>) {
        return this.getCurrentTuneBook().addPlaylistPositions(playlistId, setIds);
    }

    addEmptyPlaylist() {
        return this.getCurrentTuneBook().addEmptyPlaylist();
    }

    deleteTuneSetPosition(tuneSetId:number, position:number) {
        return this.getCurrentTuneBook().deleteTuneSetPosition(tuneSetId, position);
    }

    deletePlaylistPosition(playlistId:number, position:number) {
        this.getCurrentTuneBook().deletePlaylistPosition(playlistId, position);
    }

    deletePlaylist(playlistId:number) {
        this.getCurrentTuneBook().deletePlaylist(playlistId);
    }

    copyPlaylist(playlistId:number): number {
        return this.getCurrentTuneBook().copyPlaylist(playlistId);
    }

    copyPlaylistPositionToOtherPlaylist(sourcePlaylistId:number, sourcePlaylistPositionNr:number, targetPlaylistId:number) {
        this.getCurrentTuneBook().copyPlaylistPositionToOtherPlaylist(sourcePlaylistId, sourcePlaylistPositionNr, targetPlaylistId);
    }

    getTuneSet(tuneSetId:number) {
        return this.getCurrentTuneBook().getTuneSetById(tuneSetId);
    }

    getRandomTuneSetId() {
        let tuneSet: TuneSet;
        let tuneSetIndex = getRandomArrayIndex(this.tuneSetsFiltered);
        if (this.tuneSetsFiltered.length == tuneSetIndex) {
            tuneSetIndex = tuneSetIndex - 1;
        }
        tuneSet = this.tuneSetsFiltered[tuneSetIndex];
        return tuneSet.tuneSetId;
    }

    getRandomIntTuneId() {
        let tune: Tune;
        let tuneIndex = getRandomArrayIndex(this.tunesFiltered);
        if (this.tunesFiltered.length == tuneIndex) {
            tuneIndex = tuneIndex - 1;
        }
        tune = this.tunesFiltered[tuneIndex];
        return tune.intTuneId;
    }

    shuffleTuneList() {
        return shuffleArray(this.tunesFiltered);
    }

    shuffleTuneSetList() {
        return shuffleArray(this.tuneSetsFiltered);
    }

    getTune(intTuneId:number) {
        return this.getCurrentTuneBook().getTuneById(intTuneId);
    }

    deleteTune(intTuneId:number) {
        this.getCurrentTuneBook().deleteTune(intTuneId);
        //Remove Tune from tunesFiltered, tuneSetsFiltered
        this.setTunesFiltered();
        //TODO: when tuneSet deleted -> delete playlistposition....
    }

    getTunes() {
        return this.getCurrentTuneBook().getTunes();
    }

    getPlaylists() {
        return this.getCurrentTuneBook().playlists;
    }

    getPlaylistsFiltered() {
        return filterPlaylists(this.getCurrentTuneBook().playlists, this.getCurrentFilterSettings(), this.getTuneSetsFiltered());
    }

    getPlaylist(playlistId:number) {
        return this.getCurrentTuneBook().getPlaylistById(playlistId);
    }

    getPlaylistPositions(playlistId:number) {
        return this.getCurrentTuneBook().getPlaylistById(playlistId).playlistPositions;
    }

    getPlaylistPositionsAsNumbers(playlistId:number) {
        return this.getCurrentTuneBook().getPlaylistById(playlistId).getPlaylistPositionAsNumbers();
    }

    getPlaylistPositionsByIntTuneId(playlistId:number, intTuneId:number) {
        return this.getCurrentTuneBook().getPlaylistPositionsByIntTuneId(playlistId, intTuneId);
    }

    getPlaylistPosition(playlistId:number, position:number) {
        return this.getCurrentTuneBook().getPlaylistPosition(playlistId, position);
    }

    getPlaylistPositionByTuneSetId(playlistId:number, tuneSetId:number) {
        return this.getCurrentTuneBook().getPlaylistPositionByTuneSetId(playlistId, tuneSetId);
    }

    setTunesFiltered() {
        // filterTuneSets bringt ganze TuneSets, auch wenn nur ein Tune matched.
        // Deshalb nachgelagert die nicht matchenden Tunes erneut rausfiltern.
        if (this.getCurrentTuneBook() != null) {
            this.tuneSetsFiltered = filterTuneSets(this.getCurrentTuneBook(), this.getCurrentFilterSettings());
            this.tunesFiltered = filterTunes(extractTunes(this.tuneSetsFiltered), this.getCurrentFilterSettings());
        }
    }

    getTunesFiltered() {
        return this.tunesFiltered;
    }

    getTuneSetsFiltered() {
        return this.tuneSetsFiltered;
    }

    applyFilter() {
        this.setTunesFiltered();
    }

    getFirstTuneSetPosition(tuneSet: TuneSet) {
        return tuneSet.getFirstTuneSetPosition();
    }

    getTuneSetsByIntTuneId(intTuneId:number) {
        return this.getCurrentTuneBook().getTuneSetsByIntTuneId(intTuneId);
    }

    getPlaylistsByIntTuneId(intTuneId:number) {
        return this.getCurrentTuneBook().getPlaylistsByIntTuneId(intTuneId);
    }

    getPlaylistsByTuneSetId(tuneSetId:number) {
        return this.getCurrentTuneBook().getPlaylistsByTuneSetId(tuneSetId);
    }

    getVideo(intTuneId:number, videoSource:string, videoCode:string) {
        return this.getCurrentTuneBook().getVideoById(intTuneId, videoSource, videoCode);
    }

    addVideo(intTuneId:number, videoSource:string, videoCode:string, videoDescription:string) {
        return this.getCurrentTuneBook().addVideo(intTuneId, videoSource, videoCode, videoDescription);
    }

    deleteVideo(intTuneId:number, videoSource:string, videoCode:string) {
        this.getCurrentTuneBook().deleteVideo(intTuneId, videoSource, videoCode);
    }

    addWebsite(intTuneId:number, url:string) {
        return this.getCurrentTuneBook().addWebsite(intTuneId, url);
    }

    deleteWebsite(intTuneId:number, url:string) {
        this.getCurrentTuneBook().deleteWebsite(intTuneId, url);
    }

    getAbcforNewTuneBook() {
        //TODO: Angleichen mit initializeTuneSet und initializeTuneAndTuneSet
        var abc = "";

        abc = this.initializeAbcHeader();
        // First Tune
        abc += "X: 1";
        abc += "\n";
        abc += "T: New Tune";
        abc += "\n";

        return abc;
    }

    initializeAbcHeader() {
        var tuneBookName = "My TuneBook";
        var tuneBookDescription = "The tunes I play";
        var date = moment(new Date());
        var tuneBookVersion = date.format("YYYY-MM-DDTHH:mm");

        // Construct Header
        var tbkAbc = "%abc-";
        tbkAbc += this.systemProperties.ABC_VERSION;
        tbkAbc += "\n";
        tbkAbc += "I:abc-creator eTuneBook-";
        tbkAbc += this.systemProperties.VERSION;
        tbkAbc += "\n";
        tbkAbc += "%%etbk:bname ";
        tbkAbc += tuneBookName;
        tbkAbc += "\n";
        tbkAbc += "%%etbk:bvers ";
        tbkAbc += tuneBookVersion;
        tbkAbc += "\n";
        tbkAbc += "%%etbk:bdesc ";
        tbkAbc += tuneBookDescription;
        tbkAbc += "\n";

        return tbkAbc;
    }
}
