import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

import {TuneBook} from '../business/model/tunebook';
import {Tune} from '../business/model/tune';
import {TuneSet} from '../business/model/tuneset';
import {Playlist} from '../business/model/playlist';
import {AbcExportSettings} from '../common/settings/abc-export-settings';
import {FilterSettings} from '../common/settings/filter-settings';
import {PlaylistSettings} from '../common/settings/playlist-settings';
import {tuneUp, tuneDown} from '../business/util/transposer-util';
import {filterTunes, filterTuneSets, extractTunes, filterPlaylists} from '../business/filter/filter-logic';
import {getRandomArrayIndex, shuffleArray} from '../business/util/math-util';
import {getSystemProperties} from '../common/system-properties';
import {ACTION} from '../common/action';

@Injectable()
export class TuneBookService {
    tuneBook: TuneBook;
    tunesFiltered: Array<Tune>;
    tuneSetsFiltered: Array<TuneSet>;
    abcExportSettings: AbcExportSettings;
    filterSettings: FilterSettings;
    playlistSettings: PlaylistSettings;
    editModus: boolean;

    actionSubject: BehaviorSubject<string>;
    actionObservable: Observable<string>;
        
    systemProperties: any;
    
    constructor(public http: Http) {
        console.log("TuneBookService:constructor start");

        this.systemProperties = getSystemProperties();
        this.tuneBook = this.getCurrentTuneBook();
        this.abcExportSettings = new AbcExportSettings();
        
        this.initializeFilter();    //TODO: initializeFilter() wird schon in getCurrentTuneBook() aufgerufen!
        this.actionSubject = new BehaviorSubject("constructor");
        this.actionObservable= this.actionSubject.asObservable();
        
        this.editModus = false;
        
        this.playlistSettings = new PlaylistSettings();

        console.log("TuneBookService:constructor end");
    }

    setCurrentTuneBook(abc: string) {
        this.tuneBook = new TuneBook(abc);
        this.initializeFilter();
    }

    getCurrentTuneBook() {
        //==null checks ===null and ===undefined
        //===undefined when called from constructor
        //undefined: noch nicht zugewiesen (nur deklariert)
        //null: zugewiesen mit null
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
        this.actionSubject.next(ACTION.TOGGLE_EDIT_MODUS);
        return this.editModus;
    }

    initializeFilter() {
        if (this.filterSettings == null) {
            this.filterSettings = new FilterSettings();

        } else {
            this.filterSettings.initialize();
        }

        this.setTunesFiltered();
    }

    getTuneBookFromLocalStorage() {
        // Retrieve eTuneBook Abc from localStorage
        let abc = JSON.parse(localStorage.getItem(this.systemProperties.STORAGE_ID_TUNEBOOK) || '[]');

        if (abc == undefined || abc == "") {
            this.tuneBook = null;
        } else {
            //Convert eTuneBook Abc to eTuneBook-Model
            this.setCurrentTuneBook(abc);
        }
        return this.tuneBook;
    }

    getTuneBookFromImportedFile(abc: string, fileName: string) {
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

    getSampleAbc(tuneId: number, startFromBar: number, numberOfBars: number) {
        let tune = this.getTune(tuneId);
        return tune.getSampleAbc(startFromBar, numberOfBars);
    }

    tuneUp(tuneId: number) {
        let tune = this.getTune(tuneId);
        // Transpose up and Sync Tune-Key
        tune.key = this.getTuneKey(tuneUp(tune));
    }

    tuneDown(tuneId: number) {
        let tune = this.getTune(tuneId);
        // Transpose down and Sync Tune-Key
        tune.key = this.getTuneKey(tuneDown(tune));
    }

    initializeTuneSet(tuneId: number) {
        this.getCurrentTuneBook().initializeTuneSet(tuneId);
        this.initializeFilter();
        this.actionSubject.next(ACTION.NEW_TUNESET);
    }

    initializePartPlayInfo() {
        return this.getCurrentTuneBook().initializePartPlayInfo();
    }

    initializeTuneAndTuneSet(): TuneSet {
        let newTuneSet: TuneSet;

        if (this.getCurrentTuneBook() == null) {
            this.tuneBook = this.initializeTuneBook();
            newTuneSet = this.tuneBook.tuneSets[0];
        } else {
            newTuneSet = this.getCurrentTuneBook().initializeTuneAndTuneSet();
            this.storeTuneBookAbc();
        }

        this.initializeFilter();

        return newTuneSet;
    }

    getTuneKey(tune: Tune) {
        return tune.getTuneKey();
    }

    getTuneTitle(tune: Tune) {
        return tune.getTuneTitle();
    }

    getTuneType(tune: Tune) {
        return tune.getTuneType();
    }

    getTuneAbcId(tune: Tune) {
        return tune.getTuneAbcId();
    }

    addTunePlayDate(tune: Tune, newDate: Date) {
        tune.addPlayDate(newDate);
    }

    addTuneSetPlayDate(tuneSet: TuneSet, newDate: Date) {
        tuneSet.addPlayDate(newDate);
    }
    /* TODO: remove
        setRandomSort(tuneBook) {
            this._setRandomSort(tuneBook);
        }
    */
    initializeTuneBook() {
        this.setCurrentTuneBook(this.getAbcforNewTuneBook());
        this.storeTuneBookAbc();
        //TODO: Check if necessary and refactor
        //this.tuneBook.tuneSets[0].tuneSetPositions[0].tune.id = 1;
        return this.tuneBook;
    }
    /*
        getSettingsFromStore() {
            let settings = [];
    
            // Retrieve Settings from localStorage
            // TODO: Store AbcExportSettings and FilterSettings?
            settings = JSON.parse(localStorage.getItem(this.systemProperties.STORAGE_ID_SETTINGS) || '[]');
    
            return settings;
        }
    */
    moveTuneSetPosition(sourceTuneSetId: number, sourcePosition: number,
        targetTuneSetId: number, targetPosition: number,
        beforeOrAfter: string, moveOrCopy: string): boolean {

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

    movePlaylistPosition(playlistId: number, oldPosition: number, newPosition: number) {
        return this.getCurrentTuneBook().movePlaylistPosition(playlistId, oldPosition, newPosition);
    }

    addPlaylistPositions(playlistId: number, setIds: Array<number>) {
        return this.getCurrentTuneBook().addPlaylistPositions(playlistId, setIds);
    }

    addEmptyPlaylist(): Playlist {
        let newPlaylist: Playlist = this.getCurrentTuneBook().addEmptyPlaylist();
        this.storeTuneBookAbc();
        return newPlaylist;
    }

    deleteTuneSetPosition(tuneSetId: number, position: number) {
        this.getCurrentTuneBook().deleteTuneSetPosition(tuneSetId, position);
        this.initializeFilter();
        this.actionSubject.next(ACTION.DELETE_TUNESETPOSITION);
    }

    deletePlaylistPosition(playlistId: number, position: number) {
        this.getCurrentTuneBook().deletePlaylistPosition(playlistId, position);
    }

    deletePlaylist(playlistId: number) {
        this.getCurrentTuneBook().deletePlaylist(playlistId);
        this.storeTuneBookAbc();
    }

    copyPlaylist(playlistId: number): number {
        let newPlaylistId: number = this.getCurrentTuneBook().copyPlaylist(playlistId);
        this.storeTuneBookAbc();
        return newPlaylistId;
    }

    copyPlaylistPositionToOtherPlaylist(sourcePlaylistId: number, sourcePlaylistPositionNr: number, targetPlaylistId: number) {
        this.getCurrentTuneBook().copyPlaylistPositionToOtherPlaylist(sourcePlaylistId, sourcePlaylistPositionNr, targetPlaylistId);
    }

    getTuneSet(tuneSetId: number) {
        return this.getCurrentTuneBook().getTuneSetById(tuneSetId);
    }

    getRandomTuneSetId() {
        let tuneSet: TuneSet;
        let tuneSetIndex = getRandomArrayIndex(this.tuneSetsFiltered);
        if (this.tuneSetsFiltered.length == tuneSetIndex) {
            tuneSetIndex = tuneSetIndex - 1;
        }
        tuneSet = this.tuneSetsFiltered[tuneSetIndex];
        return tuneSet.id;
    }

    getRandomTuneId() {
        let tune: Tune;
        let tuneIndex = getRandomArrayIndex(this.tunesFiltered);
        if (this.tunesFiltered.length == tuneIndex) {
            tuneIndex = tuneIndex - 1;
        }
        tune = this.tunesFiltered[tuneIndex];
        return tune.id;
    }

    shuffleTuneList() {
        return shuffleArray(this.tunesFiltered);
    }

    shuffleTuneSetList() {
        return shuffleArray(this.tuneSetsFiltered);
    }

    getTune(tuneId: number) {
        return this.getCurrentTuneBook().getTuneById(tuneId);
    }

    deleteTune(tuneId: number) {
        this.getCurrentTuneBook().deleteTune(tuneId);
        //Remove Tune from tunesFiltered, tuneSetsFiltered
        this.setTunesFiltered();
        //TODO: when tuneSet deleted -> delete playlistposition....
        this.actionSubject.next(ACTION.DELETE_TUNE);
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

    getPlaylist(playlistId: number) {
        return this.getCurrentTuneBook().getPlaylistById(playlistId);
    }

    getPlaylistPositions(playlistId: number) {
        return this.getCurrentTuneBook().getPlaylistById(playlistId).playlistPositions;
    }

    getPlaylistPositionsAsNumbers(playlistId: number) {
        return this.getCurrentTuneBook().getPlaylistById(playlistId).getPlaylistPositionAsNumbers();
    }

    getPlaylistPositionsByTuneId(playlistId: number, tuneId: number) {
        return this.getCurrentTuneBook().getPlaylistPositionsByTuneId(playlistId, tuneId);
    }

    getPlaylistPosition(playlistId: number, position: number) {
        return this.getCurrentTuneBook().getPlaylistPosition(playlistId, position);
    }

    getPlaylistPositionByTuneSetId(playlistId: number, tuneSetId: number) {
        return this.getCurrentTuneBook().getPlaylistPositionByTuneSetId(playlistId, tuneSetId);
    }

    setTunesFiltered() {
        // filterTuneSets bringt ganze TuneSets, auch wenn nur ein Tune matched.
        // Deshalb nachgelagert die nicht matchenden Tunes erneut rausfiltern.
        if (this.getCurrentTuneBook() != null) {
            this.tuneSetsFiltered = filterTuneSets(this.getCurrentTuneBook(), this.getCurrentFilterSettings());
            this.tunesFiltered = filterTunes(extractTunes(this.tuneSetsFiltered), this.getCurrentFilterSettings());
        }
        console.log("TuneBookService:setTunesFiltered called");
    }

    getTunesFiltered() {
        return this.tunesFiltered;
    }

    getTuneSetsFiltered() {
        return this.tuneSetsFiltered;
    }

    applyFilter() {
        this.setTunesFiltered();
        this.actionSubject.next(ACTION.APPLY_FILTER);
    }

    getFirstTuneSetPosition(tuneSet: TuneSet) {
        return tuneSet.getFirstTuneSetPosition();
    }

    getTuneSetsByTuneId(tuneId: number) {
        return this.getCurrentTuneBook().getTuneSetsByTuneId(tuneId);
    }

    getPlaylistsByTuneId(tuneId: number) {
        return this.getCurrentTuneBook().getPlaylistsByTuneId(tuneId);
    }

    getPlaylistsByTuneSetId(tuneSetId: number) {
        return this.getCurrentTuneBook().getPlaylistsByTuneSetId(tuneSetId);
    }

    getVideo(tuneId: number, videoSource: string, videoCode: string) {
        return this.getCurrentTuneBook().getVideoById(tuneId, videoSource, videoCode);
    }

    addVideo(tuneId: number, videoSource: string, videoCode: string, videoDescription: string) {
        return this.getCurrentTuneBook().addVideo(tuneId, videoSource, videoCode, videoDescription);
    }

    deleteVideo(tuneId: number, videoSource: string, videoCode: string) {
        this.getCurrentTuneBook().deleteVideo(tuneId, videoSource, videoCode);
    }

    addWebsite(tuneId: number, url: string) {
        return this.getCurrentTuneBook().addWebsite(tuneId, url);
    }

    deleteWebsite(tuneId: number, url: string) {
        this.getCurrentTuneBook().deleteWebsite(tuneId, url);
    }

    getAbcforNewTuneBook() {
        //TODO: Angleichen mit initializeTuneSet und initializeTuneAndTuneSet
        let abc = "";

        abc = this.initializeAbcHeader();
        // First Tune
        abc += "X: 1";
        abc += "\n";
        abc += "T: New Tune";
        abc += "\n";

        return abc;
    }

    initializeAbcHeader() {
        let tuneBookName = "My TuneBook";
        let tuneBookDescription = "The tunes I play";
        let date = moment(new Date());
        let tuneBookVersion = date.format("YYYY-MM-DDTHH:mm");

        // Construct Header
        let tbkAbc = "%abc-";
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
