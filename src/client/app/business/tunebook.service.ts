import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

import { TuneBook, Tune, TuneSet, Playlist, Video, Website } from './model/index';
import { AbcExportSettings, FilterSettings, PlaylistSettings, SortSettings } from './settings/index';
import { tuneUp, tuneDown, getRandomArrayIndex, shuffleArray } from './util/index';
import { filterTunes, filterTuneSets, extractTunes, filterPlaylists } from './filter/index';
import { getSystemProperties } from './system.properties';
import { ACTION } from './action';

@Injectable()
export class TuneBookService {
    tuneBook: TuneBook;
    tuneBookAbcBackUp: string;

    tunesFiltered: Array<Tune>;
    tuneSetsFiltered: Array<TuneSet>;
    abcExportSettings: AbcExportSettings;
    filterSettings: FilterSettings;
    sortSettings: SortSettings;
    playlistSettings: PlaylistSettings;
    editModus: boolean;

    modelActionSubject: BehaviorSubject<string>;
    modelActionObservable: Observable<string>;

    filterActionSubject: BehaviorSubject<string>;
    filterActionObservable: Observable<string>;

    modusActionSubject: BehaviorSubject<string>;
    modusActionObservable: Observable<string>;

    systemProperties: any;

    constructor(public http: Http) {
        //console.log('TuneBookService:constructor start');

        this.systemProperties = getSystemProperties();
        this.tuneBook = this.buildTuneBookOnPageInit();
        this.abcExportSettings = new AbcExportSettings();

        this.modelActionSubject = new BehaviorSubject('constructor');
        this.modelActionObservable = this.modelActionSubject.asObservable();

        this.filterActionSubject = new BehaviorSubject('constructor');
        this.filterActionObservable = this.filterActionSubject.asObservable();

        this.modusActionSubject = new BehaviorSubject('constructor');
        this.modusActionObservable = this.modusActionSubject.asObservable();

        this.editModus = false;

        this.playlistSettings = new PlaylistSettings();
        this.sortSettings = new SortSettings();

        //console.log('TuneBookService:constructor end');
    }

    setCurrentTuneBook(abc: string) {
        this.tuneBook = new TuneBook(abc);
        this.initializeFilter();
    }

    getCurrentTuneBook() {
        return this.tuneBook;
    }

    broadCastModelAction(action: string) {
        this.modelActionSubject.next(action);
    }

    broadCastFilterAction(action: string) {
        this.filterActionSubject.next(action);
    }

    broadCastModusAction(action: string) {
        this.modusActionSubject.next(action);
    }

    getCurrentFilterSettings() {
        return this.filterSettings;
    }

    getCurrentSortSettings() {
        return this.sortSettings;
    }

    getCurrentPlaylistSettings() {
        return this.playlistSettings;
    }

    isEditModus() {
        return this.editModus;
    }

    toggleEditModus(): boolean {
        this.editModus = !this.editModus;
        this.broadCastModusAction(ACTION.TOGGLE_EDIT_MODUS);
        return this.editModus;
    }

    toggleShowPlaylistDots(): boolean {
        this.playlistSettings.toggleShowDots();
        this.broadCastModusAction(ACTION.TOGGLE_SHOW_PLAYLIST_DOTS);
        return this.editModus;
    }

    changeNumberOfBarsOfPlaylistDots() {
        //Number of Bars already changed (binding to component)
        this.broadCastModusAction(ACTION.CHANGE_NUMBER_OF_BARS_OF_PLAYLIST_DOTS);
    }

    isRendering() {
        this.broadCastModusAction(ACTION.IS_RENDERING);
    }

    isRendered() {
        this.broadCastModusAction(ACTION.IS_RENDERED);
    }

    initializeFilter() {
        if (this.filterSettings === undefined) {
            this.filterSettings = new FilterSettings();

        } else {
            this.filterSettings.initialize();
        }

        this.setTunesFiltered();
    }

    buildTuneBookOnPageInit() {
        // Retrieve eTuneBook Abc from localStorage
        //let abc = JSON.parse(localStorage.getItem(this.systemProperties.STORAGE_ID_TUNEBOOK) || '[]');
        let abc: string = localStorage.getItem(this.systemProperties.STORAGE_ID_TUNEBOOK);

        //if (abc == undefined || abc == '') {
        if (abc === null) {
            //this.tuneBook = null;
            // Initialize and store TuneBook Abc and convert to model 
            this.initializeTuneBook();
        } else {
            //Convert stored TuneBook Abc to model
            this.setCurrentTuneBook(abc);
        }
        return this.tuneBook;
    }

    getTuneBookFromImportedFile(abc: string, fileName: string) {
        this.setCurrentTuneBook(abc);
        if (this.tuneBook.name === '') {
            this.tuneBook.name = fileName;
        }
        this.storeTuneBookAbc();
        this.broadCastModelAction(ACTION.IMPORT_TUNEBOOK);
        return this.tuneBook;
    }

    getExampleTuneBookFromServer() {
        this.http.get(this.systemProperties.EXAMPLE_FILENAME)
            .map(res => res.text())
            .subscribe(data => {
                this.setCurrentTuneBook(data);
                this.storeTuneBookAbc();
                this.broadCastModelAction(ACTION.LOAD_EXAMPLE_TUNEBOOK);
            });
    }

    storeTuneBookAbcAndBroadCastAction(action: string) {
        this.storeTuneBookAbc();
        this.broadCastModelAction(action);
    }

    storeTuneBookAbc() {
        // Generate TuneBook Abc from the current TuneBook and store it in localStorage
        setTimeout(() => {
            try {
                //let tuneBookAbc: string = JSON.stringify(this.writeAbc(new AbcExportSettings()));
                let tuneBookAbc: string = this.writeAbc(new AbcExportSettings());
                //this.checkTuneBookAbcConsistency(tuneBookAbc);
                localStorage.setItem(this.systemProperties.STORAGE_ID_TUNEBOOK, tuneBookAbc);
                this.tuneBookAbcBackUp = tuneBookAbc;
                //console.log('TuneBook consistent and saved');

            } catch (e) {
                alert(e.toString());

                if (this.isQuotaExceeded(e)) {
                    // Storage full
                }

                // Reload from tuneBookAbcSave
                //this.tuneBook = new TuneBook(JSON.parse(this.tuneBookAbcBackUp));
                this.tuneBook = new TuneBook(this.tuneBookAbcBackUp);
                alert('Last action ignored. TuneBook reloaded');

            }
        }, 1000);
    }

/*
    checkTuneBookAbcConsistency(tuneBookAbc: string) {
        //let tuneBook = new TuneBook(JSON.parse(tuneBookAbc));
        let tuneBook = new TuneBook(tuneBookAbc);
    }
*/
    isQuotaExceeded(e: any) {
        let quotaExceeded = false;
        if (e) {
            if (e.code) {
                switch (e.code) {
                    case 22:
                        quotaExceeded = true;
                        break;
                    case 1014:
                        // Firefox
                        if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                            quotaExceeded = true;
                        }
                        break;
                }
            } else if (e.number === -2147024882) {
                // Internet Explorer 8
                quotaExceeded = true;
            }
        }
        return quotaExceeded;
    }
    /*
        storeSettings(settings) {
            // Store settings in localStorage
            // currently not used. check possible usage for AbcExportSettings, FilterSettings
            localStorage.setItem(this.systemProperties.STORAGE_ID_SETTINGS, JSON.stringify(settings));
        }
    */
    writeAbc(abcExportSettings: AbcExportSettings) {
        return this.getCurrentTuneBook().writeAbc(abcExportSettings);
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

    addTuneSet(tuneId: number) {
        this.getCurrentTuneBook().initializeTuneSet(tuneId);
        this.initializeFilter();
        this.storeTuneBookAbc();
        this.broadCastModelAction(ACTION.ADD_TUNESET);
    }

    initializePartPlayInfo() {
        return this.getCurrentTuneBook().initializePartPlayInfo();
    }

    initializeTuneAndTuneSet(): TuneSet {
        let newTuneSet: TuneSet;

        if (this.getCurrentTuneBook() === null) {
            //TODO: Kommt wahrscheinlich gar nie vor
            this.tuneBook = this.initializeTuneBookAndBroadcast();
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

    addTunePlayDate(tune: Tune) {
        let newDate: Date = new Date();
        tune.addPlayDate(newDate);
        this.storeTuneBookAbc();
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
    }

    initializeTuneBookAndBroadcast(): TuneBook {
        this.initializeTuneBook();
        this.broadCastModelAction(ACTION.INITIALIZE_TUNEBOOK);
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
        this.storeTuneBookAbc();
        this.broadCastFilterAction(ACTION.APPLY_FILTER);
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
        this.getCurrentTuneBook().addPlaylistPositions(playlistId, setIds);
        this.storeTuneBookAbc();
        this.broadCastModelAction(ACTION.ADD_SETS_TO_PLAYLIST);
    }

    addEmptyPlaylist(): Playlist {
        let newPlaylist: Playlist = this.getCurrentTuneBook().addEmptyPlaylist();
        this.storeTuneBookAbc();
        return newPlaylist;
    }

    deleteTuneSetPosition(tuneSetId: number, position: number) {
        this.getCurrentTuneBook().deleteTuneSetPosition(tuneSetId, position);
        this.storeTuneBookAbc();
        this.initializeFilter();
        this.broadCastModelAction(ACTION.DELETE_TUNESETPOSITION);
    }

    deletePlaylistPosition(playlistId: number, position: number) {
        this.getCurrentTuneBook().deletePlaylistPosition(playlistId, position);
        this.storeTuneBookAbc();
        this.broadCastModelAction(ACTION.DELETE_PLAYLISTPOSITION);
    }

    deletePlaylist(playlistId: number) {
        this.getCurrentTuneBook().deletePlaylist(playlistId);
        this.storeTuneBookAbc();
        this.broadCastModelAction(ACTION.DELETE_PLAYLIST);
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
        if (this.tuneSetsFiltered.length === tuneSetIndex) {
            tuneSetIndex = tuneSetIndex - 1;
        }
        tuneSet = this.tuneSetsFiltered[tuneSetIndex];
        return tuneSet.id;
    }

    getRandomTuneId() {
        let tune: Tune;
        let tuneIndex = getRandomArrayIndex(this.tunesFiltered);
        if (this.tunesFiltered.length === tuneIndex) {
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
        this.storeTuneBookAbc();
        this.broadCastModelAction(ACTION.DELETE_TUNE);
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
        // Assumes that this.tuneBook !== null and !== undefined
        // filterTuneSets bringt ganze TuneSets, auch wenn nur ein Tune matched.
        // Deshalb nachgelagert die nicht matchenden Tunes erneut rausfiltern.
        this.tuneSetsFiltered = filterTuneSets(this.getCurrentTuneBook(), this.getCurrentFilterSettings());
        this.tunesFiltered = filterTunes(extractTunes(this.tuneSetsFiltered), this.getCurrentFilterSettings());
        //console.log('TuneBookService:setTunesFiltered called');
    }

    getTunesFiltered() {
        return this.tunesFiltered;
    }

    getTuneSetsFiltered() {
        return this.tuneSetsFiltered;
    }

    applyFilter() {
        this.setTunesFiltered();
        this.broadCastFilterAction(ACTION.APPLY_FILTER);
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

    addVideo(tuneId: number, videoSource: string, videoCode: string, videoDescription: string): Video {
        let video: Video = this.getCurrentTuneBook().addVideo(tuneId, videoSource, videoCode, videoDescription);
        this.storeTuneBookAbc();
        this.broadCastModelAction(ACTION.ADD_VIDEO);
        return video;
    }

    deleteVideo(tuneId: number, videoSource: string, videoCode: string) {
        this.getCurrentTuneBook().deleteVideo(tuneId, videoSource, videoCode);
    }

    addWebsite(tuneId: number, url: string): Website {
        let website: Website = this.getCurrentTuneBook().addWebsite(tuneId, url);
        this.storeTuneBookAbc();
        this.broadCastModelAction(ACTION.ADD_WEBSITE);
        return website;
    }

    deleteWebsite(tuneId: number, url: string) {
        this.getCurrentTuneBook().deleteWebsite(tuneId, url);
    }

    getAbcforNewTuneBook() {
        //TODO: Angleichen mit initializeTuneSet und initializeTuneAndTuneSet
        let abc = '';

        abc = this.initializeAbcHeader();
        // First Tune
        abc += 'X: 1';
        abc += '\n';
        abc += 'T: New Tune';
        abc += '\n';

        return abc;
    }

    initializeAbcHeader() {
        let tuneBookName = 'My TuneBook';
        let tuneBookDescription = 'The tunes I play';
        let date = moment(new Date());
        let tuneBookVersion = date.format('YYYY-MM-DDTHH:mm');

        // Construct Header
        let tbkAbc = '%abc-';
        tbkAbc += this.systemProperties.ABC_VERSION;
        tbkAbc += '\n';
        tbkAbc += 'I:abc-creator eTuneBook-';
        tbkAbc += this.systemProperties.VERSION;
        tbkAbc += '\n';
        tbkAbc += '%%etbk:bname ';
        tbkAbc += tuneBookName;
        tbkAbc += '\n';
        tbkAbc += '%%etbk:bvers ';
        tbkAbc += tuneBookVersion;
        tbkAbc += '\n';
        tbkAbc += '%%etbk:bdesc ';
        tbkAbc += tuneBookDescription;
        tbkAbc += '\n';

        return tbkAbc;
    }
}
