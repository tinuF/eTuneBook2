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
import {eliminateThe} from '../business/util/text-util';
import {tuneUp, tuneDown} from '../business/util/transposer-util';
import {filterTunes, filterTuneSets, extractTunes, extractTuneSetPositions, filterPlaylists} from '../business/filter/filter-logic';
import {getRandomArrayIndex, shuffleArray} from '../business/util/math-util';
import {getSystemProperties} from '../common/system-properties';

@Injectable()
export class TuneBookService {
    _currentTuneBook: TuneBook;
    _systemProperties;
    _currentAbcExportSettings: AbcExportSettings;
    _currentFilterSettings: FilterSettings;
    _tunesFiltered: Array<Tune>;
    _tuneSetsFiltered: Array<TuneSet>;
    _currentTune: Tune;
    _editModus: boolean;
    _currentPlaylistSettings: PlaylistSettings;

    constructor(public http: Http) {
        this._systemProperties = getSystemProperties();
        this._currentTuneBook = this.getCurrentTuneBook();
        this._currentAbcExportSettings = new AbcExportSettings();
        this.initializeFilter();
        this._editModus = false;
        this._currentPlaylistSettings = new PlaylistSettings();
    }

    setCurrentTuneBook(abc) {
        this._currentTuneBook = new TuneBook(abc);
        this.initializeFilter();
    }

    getCurrentTuneBook() {
        if (this._currentTuneBook == null) {
            return this.getTuneBookFromLocalStorage();
        }
        return this._currentTuneBook;
    }

    getCurrentFilterSettings() {
        return this._currentFilterSettings;
    }

    getCurrentPlaylistSettings() {
        return this._currentPlaylistSettings;
    }

    getCurrentTune() {
        return this._currentTune;
    }

    isEditModus() {
        return this._editModus;
    }

    toggleEditModus(): boolean {
        this._editModus = !this._editModus;
        return this._editModus;
    }

    initializeFilter() {
        this._currentFilterSettings = new FilterSettings();
        this.setTunesFiltered();
    }

    getTuneBookFromLocalStorage() {
        // Retrieve eTuneBook Abc from localStorage
        var abc = JSON.parse(localStorage.getItem(this._systemProperties.STORAGE_ID_TUNEBOOK) || '[]');

        if (abc == undefined || abc == "") {
            this._currentTuneBook = null;
        } else {
            //Convert eTuneBook Abc to eTuneBook-Model
            this.setCurrentTuneBook(abc);
        }
        return this._currentTuneBook;
    }

    getTuneBookFromImportedFile(abc, fileName) {
        this.setCurrentTuneBook(abc);
        if (this._currentTuneBook.name == "") {
            this._currentTuneBook.name = fileName;
        }
        return this._currentTuneBook;
    }

    getDefaultFromServer() {
        this.http.get(this._systemProperties.EXAMPLE_FILENAME)
            .map(res => res.text())
            .subscribe(data => {
                this.setCurrentTuneBook(data);
                this.storeTuneBookAbc();
            });
    }

    storeTuneBookAbc() {
        // Generate TuneBook Abc from the current TuneBook and store it in localStorage
        localStorage.setItem(this._systemProperties.STORAGE_ID_TUNEBOOK, JSON.stringify(this.writeAbc(new AbcExportSettings())));
    }

    storeSettings(settings) {
        // Store settings in localStorage
        // currently not used. check possible usage for AbcExportSettings, FilterSettings
        localStorage.setItem(this._systemProperties.STORAGE_ID_SETTINGS, JSON.stringify(settings));
    }

    writeAbc(abcExportSettings: AbcExportSettings) {
        return this.getCurrentTuneBook().writeAbc(this.getAbcExportSettings());
    }

    getAbcExportSettings(): AbcExportSettings {
        return this._currentAbcExportSettings;
    }

    eliminateThe(string) {
        return eliminateThe(string);
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

    initializeTuneSetPositionPlayInfosForPlaylist(playlistId:number) {
        this.getCurrentTuneBook().initializeTuneSetPositionPlayInfosForPlaylist(playlistId);
    }

    getTuneSetPositionPlayInfo(playlistPosition, tuneSetPosition) {
        return this.getCurrentTuneBook().getTuneSetPositionPlayInfo(playlistPosition, tuneSetPosition);
    }

    getTuneSetPositionPlayInfosForPlaylistPosition(playlistPosition) {
        return this.getCurrentTuneBook().getTuneSetPositionPlayInfosForPlaylistPosition(playlistPosition);
    }

    initializeTuneAndTuneSet(): TuneSet {
        if (this.getCurrentTuneBook() == null) {
            this._currentTuneBook = this.initializeTuneBook();
            this.initializeFilter();
            return this._currentTuneBook.tuneSets[0];

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

    getTuneSite(tune:Tune, siteType) {
        return tune.getTuneSite(siteType);
    }

    addTunePlayDate(tune:Tune, newDate) {
        tune.addPlayDate(newDate);
    }

    addTuneSetPlayDate(tuneSet, newDate) {
        tuneSet.addPlayDate(newDate);
    }
    /* TODO: remove
        setRandomSort(tuneBook) {
            this._setRandomSort(tuneBook);
        }
    */
    initializeTuneBook() {
        this.setCurrentTuneBook(this._getAbcforNewTuneBook());
        //TODO: Check if necessary and refactor
        //this._currentTuneBook.tuneSets[0].tuneSetPositions[0].tune.intTuneId = 1;
        return this._currentTuneBook;
    }

    getSettingsFromStore() {
        var settings = [];

        // Retrieve Settings from localStorage
        // TODO: Store AbcExportSettings and FilterSettings?
        settings = JSON.parse(localStorage.getItem(this._systemProperties.STORAGE_ID_SETTINGS) || '[]');

        return settings;
    }

    moveTuneSetPosition(sourceTuneSetId:number, sourcePosition, targetTuneSetId:number, targetPosition, beforeOrAfter, moveOrCopy):boolean {
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

    addPlaylistPositions(playlistId:number, setIds) {
        return this.getCurrentTuneBook().addPlaylistPositions(playlistId, setIds);
    }

    addEmptyPlaylist() {
        return this.getCurrentTuneBook().addEmptyPlaylist();
    }

    deleteTuneSetPosition(iTuneSetId:number, iPosition) {
        return this.getCurrentTuneBook().deleteTuneSetPosition(iTuneSetId, iPosition);
    }

    deletePlaylistPosition(playlistId:number, position) {
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
        let tuneSetIndex = getRandomArrayIndex(this._tuneSetsFiltered);
        if (this._tuneSetsFiltered.length == tuneSetIndex) {
            tuneSetIndex = tuneSetIndex - 1;
        }
        tuneSet = this._tuneSetsFiltered[tuneSetIndex];
        return tuneSet.tuneSetId;
    }

    getRandomIntTuneId() {
        let tune: Tune;
        let tuneIndex = getRandomArrayIndex(this._tunesFiltered);
        if (this._tunesFiltered.length == tuneIndex) {
            tuneIndex = tuneIndex - 1;
        }
        tune = this._tunesFiltered[tuneIndex];
        return tune.intTuneId;
    }

    shuffleTuneList() {
        return shuffleArray(this._tunesFiltered);
    }

    shuffleTuneSetList() {
        return shuffleArray(this._tuneSetsFiltered);
    }

    getTune(intTuneId:number) {
        return this.getCurrentTuneBook().getTuneById(intTuneId);
    }

    setCurrentTune(intTuneId:number) {
        this._currentTune = this.getTune(intTuneId);
        return this._currentTune;
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

    getPlaylistPosition(playlistId:number, position) {
        return this.getCurrentTuneBook().getPlaylistPosition(playlistId, position);
    }

    getPlaylistPositionByTuneSetId(playlistId:number, tuneSetId:number) {
        return this.getCurrentTuneBook().getPlaylistPositionByTuneSetId(playlistId, tuneSetId);
    }

    setTunesFiltered() {
        // filterTuneSets bringt ganze TuneSets, auch wenn nur ein Tune matched.
        // Deshalb nachgelagert die nicht matchenden Tunes erneut rausfiltern.
        if (this.getCurrentTuneBook() != null) {
            this._tuneSetsFiltered = filterTuneSets(this.getCurrentTuneBook(), this.getCurrentFilterSettings());
            this._tunesFiltered = filterTunes(extractTunes(this._tuneSetsFiltered), this.getCurrentFilterSettings());
        }
    }

    getTunesFiltered() {
        return this._tunesFiltered;
    }

    getTuneSetsFiltered() {
        return this._tuneSetsFiltered;
    }

    applyFilter() {
        this.setTunesFiltered();
    }

    getFirstTuneSetPosition(tuneSet: TuneSet) {
        return tuneSet.getFirstTuneSetPosition();
    }

    getTuneSetPositions() {
        return this.getCurrentTuneBook().getTuneSetPositions();
    }

    getTuneSetPositionsFiltered(filterOptions) {
        return extractTuneSetPositions(filterTuneSets(this.getCurrentTuneBook(), filterOptions));
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

    getVideo(intTuneId:number, videoSource, videoCode) {
        return this.getCurrentTuneBook().getVideoById(intTuneId, videoSource, videoCode);
    }

    addVideo(intTuneId:number, videoSource, videoCode, videoDescription) {
        return this.getCurrentTuneBook().addVideo(intTuneId, videoSource, videoCode, videoDescription);
    }

    deleteVideo(intTuneId:number, videoSource, videoCode) {
        this.getCurrentTuneBook().deleteVideo(intTuneId, videoSource, videoCode);
    }

    addWebsite(intTuneId:number, url) {
        return this.getCurrentTuneBook().addWebsite(intTuneId, url);
    }

    deleteWebsite(intTuneId:number, url) {
        this.getCurrentTuneBook().deleteWebsite(intTuneId, url);
    }

    _getAbcforNewTuneBook() {
        //TODO: Angleichen mit initializeTuneSet und initializeTuneAndTuneSet
        var abc = "";

        abc = this._initializeAbcHeader();
        // First Tune
        abc += "X: 1";
        abc += "\n";
        abc += "T: New Tune";
        abc += "\n";

        return abc;
    }

    _initializeAbcHeader() {
        var tuneBookName = "My TuneBook";
        var tuneBookDescription = "The tunes I play";
        var date = moment(new Date());
        var tuneBookVersion = date.format("YYYY-MM-DDTHH:mm");

        // Construct Header
        var tbkAbc = "%abc-";
        tbkAbc += this._systemProperties.ABC_VERSION;
        tbkAbc += "\n";
        tbkAbc += "I:abc-creator eTuneBook-";
        tbkAbc += this._systemProperties.VERSION;
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
