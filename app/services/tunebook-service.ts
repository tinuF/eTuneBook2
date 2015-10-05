/// <reference path="../../tsd_typings/tsd.d.ts" />

import {TuneBook} from '../business/model/tunebook';
import {Tune} from '../business/model/tune';
import {TuneSet} from '../business/model/tuneset';
import {AbcExportSettings} from '../common/settings/abc-export-settings';
import {FilterSettings} from '../common/settings/filter-settings';
import {eliminateThe} from '../business/util/text-util';
import {tuneUp, tuneDown} from '../business/util/transposer-util';
import {filterTunes, filterTuneSets, extractSetsWithinPlayDatePeriod, extractTunes, extractTuneSetPositions} from '../business/filter/filter-logic';
import {getAbcValue} from '../business/util/abc-util';
import {getRandomArrayIndex} from '../business/util/math-util';
import {getSystemProperties} from '../common/system-properties';


export class TuneBookService {
  _currentTuneBook: TuneBook;
  _systemProperties;
  _currentAbcExportSettings: AbcExportSettings;
  _currentFilterSettings: FilterSettings;
  _tunesFiltered:Array<Tune>;
  _tuneSetsFiltered:Array<TuneSet>;
  _currentTune:Tune;

  constructor() {
    this._systemProperties = getSystemProperties();
    this._currentTuneBook = this.getCurrentTuneBook();
    this._currentAbcExportSettings = new AbcExportSettings();
    this._currentFilterSettings = new FilterSettings();
    this.setTunesFiltered();
  }

  getCurrentTuneBook() {
    if (this._currentTuneBook == null) {
      return this.getTuneBookFromLocalStorage()
    }
    return this._currentTuneBook;
  }
  
  getCurrentFilterSettings(){
    return this._currentFilterSettings;
  }
  
  getCurrentTune(){
    return this._currentTune;
  }

  getTuneBookFromLocalStorage() {
    // Retrieve eTuneBook Abc from localStorage
    var abc = JSON.parse(localStorage.getItem(this._systemProperties.STORAGE_ID_TUNEBOOK) || '[]');

    if (abc == undefined || abc == "") {
      this._currentTuneBook = null;
    } else {
      //Convert eTuneBook Abc to eTuneBook-Model
      this._currentTuneBook = new TuneBook(abc);
    }
    return this._currentTuneBook;
  }

  getTuneBookFromImportedFile(abc, fileName) {
    this._currentTuneBook = new TuneBook(abc);
    if (this._currentTuneBook.name == "") {
      this._currentTuneBook.name = fileName;
    }
    return this._currentTuneBook;
  }

  getDefaultFromServer() {
    //TODO Replace by angular 2 ajax call
    var jqxhr = jQuery.ajax({
      url: this._systemProperties.EXAMPLE_FILENAME,
      async: false,
      cache: false,
      dataType: "text"
    });

    jqxhr.done(function(data) {
      this._currentTuneBook = new TuneBook(data);
    });

    jqxhr.fail(function(data) {
      // Something went wrong, never mind lets just handle it gracefully below...
      alert("Fehler beim Laden von " + this._systemProperties.EXAMPLE_FILENAME);
    });

    return this._currentTuneBook;
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
  
  getAbcExportSettings(): AbcExportSettings{
    return this._currentAbcExportSettings;
  }

  eliminateThe(string) {
    return eliminateThe(string);
  }

  createDefaultAbcOption() {
    // TODO: Check usage
    return new AbcExportSettings();
  }

  getSampleAbc(intTuneId:number, startFromBar:number, numberOfBars:number) {
    var tune = this.getTune(intTuneId);
    return tune.getSampleAbc(startFromBar, numberOfBars);
  }

  tuneUp(intTuneId) {
    var tune = this.getTune(intTuneId);
    // Transpose up and Sync Tune-Key
    tune.key = this.getTuneKey(tuneUp(tune));
  }

  tuneDown(intTuneId) {
    var tune = this.getTune(intTuneId);
    // Transpose down and Sync Tune-Key
    tune.key = this.getTuneKey(tuneDown(tune));
  }

  initializeTuneSet(intTuneId) {
    return this.getCurrentTuneBook().initializeTuneSet(intTuneId);
  }

  initializePartPlayInfo() {
    return this.getCurrentTuneBook().initializePartPlayInfo();
  }

  initializeTuneSetPositionPlayInfosForPlaylist(playlistId) {
    this.getCurrentTuneBook().initializeTuneSetPositionPlayInfosForPlaylist(playlistId);
  }

  initializeTuneAndTuneSet(): TuneSet {
    if (this.getCurrentTuneBook() == null) {
      this._currentTuneBook = this.initializeTuneBook();
      return this._currentTuneBook.tuneSets[0];

    } else {
      return this.getCurrentTuneBook().initializeTuneAndTuneSet();
    }

  }

  getTuneKey(tune) {
    return tune.getTuneKey();
  }

  getTuneTitle(tune) {
    return tune.getTuneTitle();
  }

  getTuneType(tune) {
    return tune.getTuneType();
  }

  getTuneId(tune) {
    return tune.getTuneId();
  }

  getTuneSite(tune, siteType) {
    return tune.getTuneSite(siteType);
  }

  addTunePlayDate(tune, newDate) {
    tune.addTunePlayDate(newDate);
  }

  addTuneSetPlayDate(tuneSet, newDate) {
    tuneSet.addPlayDate(newDate);
  }

  setRandomSort(tuneBook) {
    this._setRandomSort(tuneBook);
  }

  initializeTuneBook() {
    this._currentTuneBook = new TuneBook(this._getAbcforNewTuneBook());
    //TODO: Check if necessary and refactor
    this._currentTuneBook.tuneSets[0].tuneSetPositions[0].tune.intTuneId = 1;
    return this._currentTuneBook;
  }

  getSettingsFromStore() {
    var settings = [];

    // Retrieve Settings from localStorage
    // TODO: Store AbcExportSettings and FilterSettings?
    settings = JSON.parse(localStorage.getItem(this._systemProperties.STORAGE_ID_SETTINGS) || '[]');

    return settings;
  }

  moveTuneSetPosition(sourceTuneSetId, sourcePosition, targetTuneSetId, targetPosition, beforeOrAfter, moveOrCopy) {
    return this.getCurrentTuneBook().moveTuneSetPosition(sourceTuneSetId, sourcePosition, targetTuneSetId, targetPosition, beforeOrAfter, moveOrCopy);
  }

  moveUpPlaylistPosition(playlistId, position) {
    return this.getCurrentTuneBook().moveUpPlaylistPosition(playlistId, position);
  }

  moveDownPlaylistPosition(playlistId, position) {
    return this.getCurrentTuneBook().moveDownPlaylistPosition(playlistId, position);
  }

  addEmptyPlaylistPosition(playlistId) {
    return this.getCurrentTuneBook().addEmptyPlaylistPosition(playlistId);
  }

  addEmptyPlaylist() {
    return this.getCurrentTuneBook().addEmptyPlaylist();
  }

  deleteTuneSetPosition(iTuneSetId, iPosition) {
    return this.getCurrentTuneBook().deleteTuneSetPosition(iTuneSetId, iPosition);
  }

  deletePlaylistPosition(playlistId, position) {
    this.getCurrentTuneBook().deletePlaylistPosition(playlistId, position);
  }

  deletePlaylist(playlistId) {
    this.getCurrentTuneBook().deletePlaylist(playlistId);
  }

  copyPlaylist(playlistId) {
    this.getCurrentTuneBook().copyPlaylist(playlistId);
  }

  copyPlaylistPositionToOtherPlaylist(sourcePlaylistId, sourcePlaylistPositionNr, targetPlaylistId) {
    this.getCurrentTuneBook().copyPlaylistPositionToOtherPlaylist(sourcePlaylistId, sourcePlaylistPositionNr, targetPlaylistId);
  }

  getTuneSet(tuneSetId) {
    return this.getCurrentTuneBook().getTuneSetById(tuneSetId);
  }

  getRandomTuneSetId(playDateFilter) {
    var sets = extractSetsWithinPlayDatePeriod(this.getCurrentTuneBook(), playDateFilter);
    var tuneSetIndex = getRandomArrayIndex(sets);
    return sets[tuneSetIndex].tuneSetId;
  }

  getRandomIntTuneId() {
    let tuneIndex = getRandomArrayIndex(this._tunesFiltered);
    return this._tunesFiltered[tuneIndex].intTuneId;
  }

  getTune(intTuneId) {
    return this.getCurrentTuneBook().getTuneById(intTuneId);
  }
  
  setCurrentTune(intTuneId) {
    this._currentTune = this.getTune(intTuneId);
    return this._currentTune;
  }
  

  deleteTuneSetPositionsAndTune(intTuneId) {
    this.getCurrentTuneBook().deleteTuneSetPositionsAndTune(intTuneId);
  }

  getTunes() {
    return this.getCurrentTuneBook().getTunes();
  }

  getPlaylists() {
    return this.getCurrentTuneBook().playlists;
  }

  getPlaylist(playlistId) {
    return this.getCurrentTuneBook().getPlaylistById(playlistId);
  }

  getPlaylistPositionsByIntTuneId(playlistId, intTuneId) {
    return this.getCurrentTuneBook().getPlaylistPositionsByIntTuneId(playlistId, intTuneId);
  }

  getPlaylistPosition(playlistId, position) {
    return this.getCurrentTuneBook().getPlaylistPosition(playlistId, position);
  }

  setTunesFiltered() {
    // filterTuneSets bringt ganze TuneSets, auch wenn nur ein Tune matched.
    // Deshalb nachgelagert die nicht matchenden Tunes erneut rausfiltern.
    if (this.getCurrentTuneBook() != null){
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
  
  applyFilter(){
    this.setTunesFiltered();
  }

  getFirstTuneSetPositions() {
    return this.getCurrentTuneBook().extractFirstTuneSetPositions();
  }

  getFirstTuneSetPosition(tuneSet: TuneSet) {
    return tuneSet.getFirstTuneSetPosition();
  }

  getFirstTuneSetPositionById(tuneSetId) {
    return this.getCurrentTuneBook().getFirstTuneSetPositionById(tuneSetId);
  }

  getTuneSetPositions() {
    return this.getCurrentTuneBook().getTuneSetPositions();
  }

  getTuneSetPositionsFiltered(filterOptions) {
    return extractTuneSetPositions(filterTuneSets(this.getCurrentTuneBook(), filterOptions));
  }

  getTuneSetsAsTuneSetPositions(intTuneId) {
    return this.getCurrentTuneBook().getTuneSetsAsTuneSetPositions(intTuneId);
  }

  getTuneSetsByIntTuneId(intTuneId) {
    return this.getCurrentTuneBook().getTuneSetsByIntTuneId(intTuneId);
  }

  getPlaylistsByIntTuneId(intTuneId) {
    return this.getCurrentTuneBook().getPlaylistsByIntTuneId(intTuneId);
  }

  getVideo(intTuneId, videoSource, videoCode) {
    return this.getCurrentTuneBook().getVideoById(intTuneId, videoSource, videoCode);
  }

  addVideo(intTuneId, videoSource, videoCode, videoDescription) {
    return this.getCurrentTuneBook().addVideo(intTuneId, videoSource, videoCode, videoDescription);
  }

  deleteVideo(intTuneId, videoSource, videoCode) {
    this.getCurrentTuneBook().deleteVideo(intTuneId, videoSource, videoCode);
  }

  addWebsite(intTuneId, url) {
    return this.getCurrentTuneBook().addWebsite(intTuneId, url);
  }

  deleteWebsite(intTuneId, url) {
    this.getCurrentTuneBook().deleteWebsite(intTuneId, url);
  }

  // currently not used. was implemented for ramdom sort in list.
  _setRandomSort(tuneBook) {
    var randomNumber = 0;
    for (var i = 0; i < tuneBook.tuneSets.length; i++) {
      randomNumber = Math.floor(Math.random() * 100001);
      tuneBook.tuneSets[i].sort = randomNumber;
    }
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
