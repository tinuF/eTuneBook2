/// <reference path="../../../tsd_typings/tsd.d.ts" />

import {getSystemProperties} from '../../common/system-properties';
import {getAbcValue} from '../util/abc';
import {importTuneSets} from '../converter/tuneset-importer';
import {importPlaylists, importPlaylistPositions, importTuneSetPositionPlayInfos} from '../converter/playlists-importer';
import {extractTunes, extractTuneSetPositions} from '../filter/filter';
import {writeAbcHeader, writeTuneAbc} from '../converter/abc-writer';
import {TuneSet} from './tuneset';
import {Tune} from './tune';
import {TuneSetPosition} from './tunesetposition';
import {Playlist} from './playlist';
import {PlaylistPosition} from './playlistposition';
import {TuneSetPositionPlayInfo} from './tunesetposition-playinfo';
import {PartPlayInfo} from './partplayinfo';
import {AbcExportSettings} from '../../common/settings/abc-export';


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

    this._extract();
  }

  _extract(){
    this.tuneSets = importTuneSets(this.abcjsBook);   //TuneSets zuerst, weil Playlists auf TuneSets referenzieren
    this.playlists = importPlaylists(this.header);
    importPlaylistPositions(this);
    this.tuneSetPositionPlayInfos = importTuneSetPositionPlayInfos(this);
  }


  getTuneById(intTuneId){
    for (var i = 0; i < this.tuneSets.length; i++) {
      for (var z = 0; z < this.tuneSets[i].tuneSetPositions.length; z++) {
        if (intTuneId == this.tuneSets[i].tuneSetPositions[z].tune.intTuneId) {
          return this.tuneSets[i].tuneSetPositions[z].tune;
        }
      }
    }
    return null;
  }

  getTuneSetById(tuneSetId){
    for (var i = 0; i < this.tuneSets.length; i++) {
      if (tuneSetId == this.tuneSets[i].tuneSetId) {
        return this.tuneSets[i];
      }
    }
    return null;
  }

  getPlaylistById(playlistId){
    for (var i = 0; i < this.playlists.length; i++) {
      if (playlistId == this.playlists[i].id) {
        return this.playlists[i];
      }
    }
    return null;
  }

  getPlaylistPosition(playlistId, playlistPositionNr){
      var playlist;

      playlist = this.getPlaylistById(playlistId);

      return playlist.getPlaylistPosition(playlistPositionNr);
  }

  getTuneSetsByIntTuneId(intTuneId){
      var tuneSets = [];

      for (var i = 0; i < this.tuneSets.length; i++) {
          for (var z = 0; z < this.tuneSets[i].tuneSetPositions.length; z++) {
              if(intTuneId == this.tuneSets[i].tuneSetPositions[z].tune.intTuneId){
                  tuneSets.push(this.tuneSets[i]);
              }
          }
      }

      return tuneSets;
  }


  getPlaylistsByIntTuneId(intTuneId){
      var tuneSets = this.getTuneSetsByIntTuneId(intTuneId);
      var playlists = [];
      var playlistSelected = false;

      for (var i = 0; i < tuneSets.length; i++) {
          for (var z = 0; z < this.playlists.length; z++) {
              for (var y = 0; y < this.playlists[z].playlistPositions.length; y++) {
                  if(this.playlists[z].playlistPositions[y].tuneSet == tuneSets[i]){
                      playlistSelected = false;
                      for (var w = 0; w < playlists.length; w++) {
                          if(playlists[w] == this.playlists[z]){
                              playlistSelected = true;
                          }
                      }
                      if(!playlistSelected){
                          playlists.push(this.playlists[z]);
                      }
                  }
              }
          }
      }

      return playlists;
  }

  getPlaylistsByTuneSetId(tuneSetId){
      var playlist, playlists, playlistAdded;
      playlists = [];

      for (var i = 0; i < this.playlists.length; i++) {
          playlist = this.playlists[i];
          playlistAdded = false;

          for (var z = 0; z < playlist.playlistPositions.length && !playlistAdded; z++) {
              if(playlist.playlistPositions[z].tuneSet.tuneSetId == tuneSetId){
                  playlists.push(playlist);
                  playlistAdded = true;
              }
          }
      }

      return playlists;
  }

  getPlaylistPositionsByTuneSetId(tuneSetId){
      var playlist, playlistPositions;
      playlistPositions = [];

      for (var i = 0; i < this.playlists.length; i++) {
          playlist = this.playlists[i];

          for (var z = 0; z < playlist.playlistPositions.length; z++) {
              if(playlist.playlistPositions[z].tuneSet.tuneSetId == tuneSetId){
                  playlistPositions.push(playlist.playlistPositions[z]);
              }
          }
      }

      return playlistPositions;
  }

  writeAbc(abcExportSettings:AbcExportSettings){
    // Generate Abc
    var tbkAbc, tuneAbc, tunes;

    tunes = [];
    tuneAbc = "";
    tbkAbc = "";

    // Construct Header
    tbkAbc = writeAbcHeader(this, abcExportSettings);

    // Get Tunes
    tunes = this.getTunes();

    // Sort Tunes by intTuneId
    tunes.sort(function(a, b){
      return a.intTuneId-b.intTuneId
    });

    for (var i = 0; i < tunes.length; i++) {
      tuneAbc = writeTuneAbc(tunes[i], this.getTuneSetPositionsByIntTuneId(tunes[i].intTuneId), abcExportSettings);
      tbkAbc += tuneAbc;
      tbkAbc += "\n";	//empty line between tunes
    }

    return tbkAbc;
  }

  getTunes():Array<Tune>{
    // Extract Tunes form TuneSets.

    return extractTunes(this.tuneSets);
  }

  getTuneSetPositionsByIntTuneId(intTuneId){
      var tuneSetPositions = [];

      for (var i = 0; i < this.tuneSets.length; i++) {
          for (var z = 0; z < this.tuneSets[i].tuneSetPositions.length; z++) {
              if(intTuneId == this.tuneSets[i].tuneSetPositions[z].tune.intTuneId){
                  tuneSetPositions.push(this.tuneSets[i].tuneSetPositions[z]);
              }
          }
      }

      return tuneSetPositions;
  }

  copyPlaylist(playlistId){
      var playlistId, playlistName, playlistOriginal, playlistCopy;

      playlistOriginal = this.getPlaylistById(playlistId);

      playlistId = this._getNextPlaylistId();
      playlistName = 'Copy of ' + playlistOriginal.name;

      playlistCopy = new Playlist(playlistId, playlistName, playlistOriginal.event, playlistOriginal.band);
      this.playlists.push(playlistCopy);

      this._copyPlaylistPositions(playlistOriginal, playlistCopy);
  }

  _getNextPlaylistId(){
      var nextPlaylistId, currentPlaylistId,  maxPlaylistId;

      maxPlaylistId = 0;

      for (var i = 0; i < this.playlists.length; i++) {

          currentPlaylistId = parseInt(this.playlists[i].id);
          if (currentPlaylistId > maxPlaylistId){
              maxPlaylistId = currentPlaylistId;
          }
      }


      nextPlaylistId = maxPlaylistId + 1;
      return nextPlaylistId;
  }

  _copyPlaylistPositions(playlistOriginal, playlistCopy){
      var playlistPositionOriginal, playlistPositionCopy;

      for (var y = 0; y < playlistOriginal.playlistPositions.length; y++) {
          playlistPositionOriginal = playlistOriginal.playlistPositions[y];

          this._copyPlaylistPositionAndTuneSetPlayInfos(playlistPositionOriginal, playlistCopy, playlistPositionOriginal.position);
      }
  }

  _copyPlaylistPositionAndTuneSetPlayInfos(playlistPositionOriginal, targetPlaylist, targetPlaylistPositionNr){
      var playlistPositionCopy;

      // Generate PlaylistPosition
      playlistPositionCopy = new PlaylistPosition(targetPlaylist.id, targetPlaylistPositionNr, playlistPositionOriginal.tuneSet, playlistPositionOriginal.name, playlistPositionOriginal.annotation);

      // Add PlaylistPosition to Playlist
      targetPlaylist.addPlaylistPosition(playlistPositionCopy);

      // Copy TuneSetPositionPlayInfos
      this._copyTuneSetPositionPlayInfos(playlistPositionOriginal, playlistPositionCopy);
  }

  _copyTuneSetPositionPlayInfos(playlistPositionOriginal, playlistPositionCopy){
      var tuneSetPositionPlayInfosOriginal, tuneSetPositionPlayInfosCopy,
          tuneSetPositionPlayInfoOriginal, tuneSetPositionPlayInfoCopy, partPlayInfosCopy;

      tuneSetPositionPlayInfosOriginal = this.getTuneSetPositionPlayInfosForPlaylistPosition(playlistPositionOriginal);

      for (var y = 0; y < tuneSetPositionPlayInfosOriginal.length; y++) {
          tuneSetPositionPlayInfoOriginal = tuneSetPositionPlayInfosOriginal[y];

          // Copy partPlayInfos
          partPlayInfosCopy = this._copyPartPlayInfos(tuneSetPositionPlayInfoOriginal);

          // Generate tuneSetPositionPlayInfo
          tuneSetPositionPlayInfoCopy = new TuneSetPositionPlayInfo(playlistPositionCopy, tuneSetPositionPlayInfoOriginal.tuneSetPosition, tuneSetPositionPlayInfoOriginal.repeat, partPlayInfosCopy, tuneSetPositionPlayInfoOriginal.annotation);
          this.tuneSetPositionPlayInfos.push(tuneSetPositionPlayInfoCopy);
      }
  }

  getTuneSetPositionPlayInfosForPlaylistPosition(playlistPosition){
      var tuneSetPositionPlayInfos, tuneSetPositionPlayInfo;

      tuneSetPositionPlayInfos = [];

      for (var z = 0; z < this.tuneSetPositionPlayInfos.length; z++) {
          if (this.tuneSetPositionPlayInfos[z].playlistPosition == playlistPosition){
              tuneSetPositionPlayInfo = this.tuneSetPositionPlayInfos[z];
              tuneSetPositionPlayInfos.push(tuneSetPositionPlayInfo);
          }
      }

      return tuneSetPositionPlayInfos;
  }

  _copyPartPlayInfos(tuneSetPositionPlayInfoOriginal){
      var partPlayInfosOriginal, partPlayInfosCopy,
          partPlayInfoOriginal, partPlayInfoCopy;

      partPlayInfosCopy = [];

      for (var y = 0; y < tuneSetPositionPlayInfoOriginal.partPlayInfos.length; y++) {
          partPlayInfoOriginal = tuneSetPositionPlayInfoOriginal.partPlayInfos[y];

          // Generate partPlayInfo
          partPlayInfoCopy = new PartPlayInfo(partPlayInfoOriginal.part, partPlayInfoOriginal.playInfo);
          partPlayInfosCopy.push(partPlayInfoCopy);
      }

      return partPlayInfosCopy;
  }

  copyPlaylistPositionToOtherPlaylist(sourcePlaylistId, sourcePlaylistPositionNr, targetPlaylistId){
      var playlistPosition, targetPlaylist, targetPlaylistPositionNr;

      playlistPosition = this.getPlaylistPosition(sourcePlaylistId, sourcePlaylistPositionNr);
      targetPlaylist = this.getPlaylistById(targetPlaylistId);
      // Am Schluss einfügen
      targetPlaylistPositionNr = targetPlaylist.playlistPositions.length + 1;

      this._copyPlaylistPositionAndTuneSetPlayInfos(playlistPosition, targetPlaylist, targetPlaylistPositionNr);
  }

  moveTuneSetPosition(sourceTuneSetId, sourcePosition, targetTuneSetId, targetPosition, beforeOrAfter, moveOrCopy){
      // Moving or Copying a TuneSetPosition
      var sourceTuneSet = this.getTuneSetById(sourceTuneSetId);
      var sourceTuneSetPosition: TuneSetPosition = null;
      var targetTuneSet = null;
      var tuneSetDeleted = false;
      var twoSetsInvolved = false;
      var removedPosition = parseInt(sourcePosition);

      if (targetTuneSetId == null || sourceTuneSetId !== targetTuneSetId){
          twoSetsInvolved = true;
      }

      for (var z = 0; z < sourceTuneSet.tuneSetPositions.length; z++) {
          if (sourceTuneSet.tuneSetPositions[z].position == sourcePosition){
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
      if (moveOrCopy == "move"){

          if (twoSetsInvolved) {
              // Remove TuneSetPosition from Source TuneSet
              for (var z = 0; z < sourceTuneSet.tuneSetPositions.length; z++) {
                  if (sourceTuneSet.tuneSetPositions[z].position == sourcePosition){
                      // Delete TuneSetPosition from TuneSet
                      sourceTuneSet.tuneSetPositions.splice(z, 1);
                  }
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
              var currentPosition = 0;

              for (var y = 0; y < sourceTuneSet.tuneSetPositions.length; y++) {
                  currentPosition = parseInt(sourceTuneSet.tuneSetPositions[y].position);

                  if (currentPosition > removedPosition) {
                      currentPosition--;
                      // Change Position on TuneSetPosition
                      sourceTuneSet.tuneSetPositions[y].position = currentPosition.toString();
                  }
              }
          }
      }

      // Handle Target TuneSet
      if (targetTuneSetId != null) {
          var newPosition = 0;
          newPosition = parseInt(targetPosition);

          if (beforeOrAfter == "after"){
              newPosition++;
          }

          var targetTuneSetPosition: TuneSetPosition;

          if (moveOrCopy == "move"){
              // Set new TuneSetId and Position on TuneSetPosition
              // copy by reference
              targetTuneSetPosition = sourceTuneSetPosition;
              targetTuneSetPosition.tuneSetId = targetTuneSetId;
              targetTuneSetPosition.position = newPosition.toString();

          } else if (moveOrCopy == "copy"){
              // Set new TuneSetId and Position on TuneSetPosition
              // copy by value (primitive types), copy by reference (objects) -> tune is shared
              targetTuneSetPosition = new TuneSetPosition(targetTuneSetId,sourceTuneSetPosition.tune, newPosition.toString(), sourceTuneSetPosition.repeat, sourceTuneSetPosition.annotation);
          }

          // Add TuneSetPosition to TuneSet (only if source tuneSet ist different from target tuneSet)
          if (twoSetsInvolved) {
              // At index (newPosition--) insert the moving TuneSetPosition, but don't remove other TuneSetPositions
              var insertAt = newPosition - 1;
              targetTuneSet.tuneSetPositions.splice(insertAt,0,targetTuneSetPosition);
          }

          // Change Position of other TuneSetPositions in the Targe-Set:
          // Only necessary for tunes that come after the inserted tune
          for (var y = 0; y < targetTuneSet.tuneSetPositions.length; y++) {

              var currentPosition = 0;

              if (targetTuneSet.tuneSetPositions[y] == targetTuneSetPosition){
                  // TuneSetPosition which was moved: Already Done

              } else {
                  // TuneSetPositions which were not moved
                  currentPosition = parseInt(targetTuneSet.tuneSetPositions[y].position);

                  if (currentPosition >= newPosition) {
                      currentPosition++;
                      // Change Position on TuneSetPosition
                      targetTuneSet.tuneSetPositions[y].position = currentPosition.toString();
                  }
              }
          }
      }

      return tuneSetDeleted;
  }

  moveUpPlaylistPosition(playlistId, position){
      var playlist;

      playlist = this.getPlaylistById(playlistId);

      playlist.moveUpPlaylistPosition(position);

      return playlist;
  }

  moveDownPlaylistPosition(playlistId, position){
      var playlist;

      playlist = this.getPlaylistById(playlistId);

      playlist.moveDownPlaylistPosition(position);

      return playlist;
  }

  initializeTuneSet(intTuneId) {
      return this._initializeTuneSet(this.getTuneById(intTuneId));
  }

  _initializeTuneSet(tune){
    // Get next tuneSetId
    var nextTuneSetId = this._getNextTuneSetId();
    var tuneSet: TuneSet;
    var tuneSetPositions = [];
    var tuneSetPosition = new TuneSetPosition(nextTuneSetId, tune, 1, "3x", "");
    //addNewTuneSetDirective(tuneSetPosition);
    tuneSetPositions.push(tuneSetPosition);
    tuneSet = new TuneSet(nextTuneSetId, tune.title, tuneSetPositions);

    this.tuneSets.unshift(tuneSet);


    return tuneSet;
  }

  _getNextTuneSetId(){
    var nextTuneSetId, currentTuneSetId, maxTuneSetId;

    maxTuneSetId = 0;

    for (var i = 0; i < this.tuneSets.length; i++) {
      //currentTuneSetId = parseInt(this.tuneSets[i].tuneSetId);
      currentTuneSetId = this.tuneSets[i].tuneSetId;
      if (currentTuneSetId > maxTuneSetId){
        maxTuneSetId = currentTuneSetId;
      }
    }

    nextTuneSetId = maxTuneSetId + 1;
    return nextTuneSetId;
  }

  deletePlaylistPosition(playlistId, position){
      var playlist = this.getPlaylistById(playlistId);

      playlist.deletePlaylistPosition(position);
  }

  deletePlaylist(playlistId){
      var playlist = this.getPlaylistById(playlistId);

      for (var z = 0; z < this.playlists.length; z++) {
          if (this.playlists[z].id == playlistId){
              // Delete all playlistPositions
              // nicht nötig, da beim Export die Playlist der Trigger ist

              // Delete playlist
              this.playlists.splice(z, 1);
          }
      }
  }

  deleteTuneSetPosition(tuneSetId, position){
    // Deleting a TuneSetPosition: The Tune can end up set-less -> in this case a new set is generated.
    var tuneSet, tuneSetPosition, playlistPositions, tuneSetPositionPlayInfo, tuneSetDeleted, removedPosition;

    tuneSet = this.getTuneSetById(tuneSetId);
    tuneSetPosition = null;
    playlistPositions = [];
    tuneSetDeleted = false;
    removedPosition = 0;
    removedPosition = parseInt(position);

    for (var z = 0; z < tuneSet.tuneSetPositions.length; z++) {
      if (tuneSet.tuneSetPositions[z].position == position){
        tuneSetPosition = tuneSet.tuneSetPositions[z];
        // Delete TuneSetPosition from TuneSet
        tuneSet.tuneSetPositions.splice(z, 1);
      }
    }

    if(this.getTuneSetsByIntTuneId(tuneSetPosition.tune.intTuneId).length == 0){
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
      var currentPosition = 0;

      for (var y = 0; y < tuneSet.tuneSetPositions.length; y++) {
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

    for (var w = 0; w < playlistPositions.length; w++) {
      tuneSetPositionPlayInfo = this.getTuneSetPositionPlayInfo(playlistPositions[w], tuneSetPosition);
      // Remove TuneSetPositionPlayInfo from the List
      this.tuneSetPositionPlayInfos.splice(this.tuneSetPositionPlayInfos.indexOf(tuneSetPositionPlayInfo), 1);

      if(tuneSetDeleted){
        // Delete PlaylistPositions
        this.deletePlaylistPosition(playlistPositions[w].playlistId, playlistPositions[w].position);
      }


    }

    return tuneSetDeleted;
  }

  initializeTuneSetPositionPlayInfosForPlaylist(playlistId) {
      var playlist, playlistPosition, tuneSet, tuneSetPosition, tuneSetPositionPlayInfo, partPlayInfos;

      playlist = this.getPlaylistById(playlistId);

      for (var i = 0; i < playlist.playlistPositions.length; i++) {

          playlistPosition = playlist.playlistPositions[i];
          tuneSet = playlistPosition.tuneSet;

          for (var z = 0; z < tuneSet.tuneSetPositions.length; z++) {
              tuneSetPositionPlayInfo = undefined;
              tuneSetPosition = tuneSet.tuneSetPositions[z];
              tuneSetPositionPlayInfo = this.getTuneSetPositionPlayInfo(playlistPosition, tuneSetPosition);

              if(tuneSetPositionPlayInfo == undefined){
                  partPlayInfos = [];
                  tuneSetPositionPlayInfo = new TuneSetPositionPlayInfo(playlistPosition, tuneSetPosition, tuneSetPosition.repeat, partPlayInfos, tuneSetPosition.annotation);
                  this.tuneSetPositionPlayInfos.push(tuneSetPositionPlayInfo);
              }

              // Setzen der aktuellen für die Playlist relevanten Play Infos (nötig für Bildschirm)
              // Hinweis: Ist eine TuneSetPosition zweimal in einer Playlist vorhanden,
              // dann wird die PlayInfo der letzten PlaylistPosition auf currentTuneSetPositionPLayInfo gesetzt.
              // -> es ist momentan nicht möglich ein TuneSet unter verschiedenen PlaylistPositions und mit
              // verschiedenen PlayInfos zu führen.
              tuneSetPosition.currentTuneSetPositionPlayInfo = tuneSetPositionPlayInfo;
          }
      }
  }

  getPlaylistPositionsByIntTuneId(playlistId, intTuneId){
      var playlistPositions = [];
      var tuneSets = this.getTuneSetsByIntTuneId(intTuneId);
      var playlist = this.getPlaylistById(playlistId);

      for (var i = 0; i < tuneSets.length; i++) {
          for (var y = 0; y < playlist.playlistPositions.length; y++) {
              if(playlist.playlistPositions[y].tuneSet == tuneSets[i]){
                  playlistPositions.push(playlist.playlistPositions[y]);
              }
          }
      }

      return playlistPositions;
  }

  getTuneSetPositionsForTuneSetId(tuneSetId, tuneSetPositions){
      // Extract TuneSetPositions from TuneSets.
      for (var i = 0; i < this.tuneSets.length; i++) {
          for (var z = 0; z < this.tuneSets[i].tuneSetPositions.length; z++) {
              if(tuneSetId == this.tuneSets[i].tuneSetPositions[z].tuneSetId){
                  tuneSetPositions.push(this.tuneSets[i].tuneSetPositions[z]);
              }
          }
      }

      return tuneSetPositions;
  }

  getTuneSetsAsTuneSetPositions(intTuneId){
      // Extract TuneSetPositions from TuneSets.
      var tuneSetIds = [];
      var tuneSetPositions = [];

      //First get TuneSetIds for intTuneId
      for (var i = 0; i < this.tuneSets.length; i++) {
          for (var z = 0; z < this.tuneSets[i].tuneSetPositions.length; z++) {
              if(intTuneId == this.tuneSets[i].tuneSetPositions[z].tune.intTuneId){
                  tuneSetIds.push(this.tuneSets[i].tuneSetId);
              }
          }
      }

      //Then get TuneSetPositions for the tuneSetIds
      for (var y = 0; y < tuneSetIds.length; y++) {
          this.getTuneSetPositionsForTuneSetId(tuneSetIds[y], tuneSetPositions);
      }

      return tuneSetPositions;
  }

  extractFirstTuneSetPositions(){
      // Extract First TuneSetPositions from all TuneSets.
      var tuneSetPositions = [];

      for (var i = 0; i < this.tuneSets.length; i++) {
          for (var z = 0; z < this.tuneSets[i].tuneSetPositions.length; z++) {
              if (this.tuneSets[i].tuneSetPositions[z].position == "1"){
                  tuneSetPositions.push(this.tuneSets[i].tuneSetPositions[z]);
              }
          }
      }

      return tuneSetPositions;
  }

  getTuneSetPositions(){
      // Extract TuneSetPositions from TuneSets.

      return extractTuneSetPositions(this.tuneSets);
  }

  addVideo(intTuneId, videoSource, videoCode, videoDescription){
    var tune;
    tune = this.getTuneById(intTuneId);
    if (tune != null) {
      return tune.addVideo(videoSource, videoCode, videoDescription);
    }
    return null;
  }

  addWebsite(intTuneId, url){
    var tune;
    tune = this.getTuneById(intTuneId);
    if (tune != null) {
      return tune.addWebsite(url);
    }
    return null;
  }


  getVideoById(intTuneId, videoSource, videoCode){
    var tune = this.getTuneById(intTuneId);
    if (tune != null) {
        return tune.getVideoById(videoSource, videoCode);
    }
    return null;
  }

  deleteVideo(intTuneId, videoSource, videoCode){
    var tune, index, remove=false;
    tune = this.getTuneById(intTuneId);
    if (tune != null) {
      tune.deleteVideo(videoSource, videoCode);
    }
  }

  deleteWebsite(intTuneId, url){
    var tune, wsite, index, remove=false;
    tune = this.getTuneById(intTuneId);
    if (tune != null) {
      tune.deleteWebsite(url);
    }
  }

  deleteTuneSetPositionsAndTune(intTuneId) {
      var tuneSets = [];
      tuneSets = this.getTuneSetsByIntTuneId(intTuneId);
      for (var i = 0; i < tuneSets.length; i++) {
          this._deleteTuneSetPositionsAndTune(tuneSets[i], intTuneId);
      }
  }

  _deleteTuneSetPositionsAndTune(tuneSet, intTuneId){
      var tuneSetPosition = null;
      var removedPosition = 0;

      for (var z = 0; z < tuneSet.tuneSetPositions.length; z++) {
          if (tuneSet.tuneSetPositions[z].tune.intTuneId == intTuneId){
              removedPosition = parseInt(tuneSet.tuneSetPositions[z].position);
              tuneSetPosition = tuneSet.tuneSetPositions[z];
              // Delete TuneSetPosition from TuneSet
              tuneSet.tuneSetPositions.splice(z, 1);
          }
      }

      if (tuneSet.tuneSetPositions.length == 0) {
          // Empty TuneSet
          // Remove TuneSet from the List
          this.tuneSets.splice(this.tuneSets.indexOf(tuneSet), 1);

      } else {
          // TuneSet still has TuneSetPositions
          // Adjust Positions of remaining TuneSetPositions: Only necessary for tunes that come after the removed tune
          var currentPosition = 0;

          for (var y = 0; y < tuneSet.tuneSetPositions.length; y++) {
              currentPosition = parseInt(tuneSet.tuneSetPositions[y].position);

              if (currentPosition > removedPosition) {
                  currentPosition--;
                  // Change Position on TuneSetPosition
                  tuneSet.tuneSetPositions[y].position = currentPosition.toString();
              }
          }
      }
  }

  addEmptyPlaylistPosition(playlistId){
      var playlist, emptyPlaylistPosition;

      playlist = this.getPlaylistById(playlistId);
      emptyPlaylistPosition = new PlaylistPosition(playlist.id, playlist.playlistPositions.length + 1, null, "", "");
      playlist.playlistPositions.push(emptyPlaylistPosition);

      return emptyPlaylistPosition;
  }

  addEmptyPlaylist(){
      var emptyPlaylist;

      emptyPlaylist = new Playlist(this._getNextPlaylistId(),"","","");
      this.playlists.push(emptyPlaylist);

      return emptyPlaylist;
  }

  getTuneSetPositionPlayInfo(playlistPosition, tuneSetPosition){
      var tuneSetPositionPlayInfo;

      tuneSetPositionPlayInfo = undefined;

      for (var z = 0; z < this.tuneSetPositionPlayInfos.length; z++) {
          if (this.tuneSetPositionPlayInfos[z].playlistPosition == playlistPosition
              && this.tuneSetPositionPlayInfos[z].tuneSetPosition == tuneSetPosition){
              tuneSetPositionPlayInfo = this.tuneSetPositionPlayInfos[z];
          }
      }

      return tuneSetPositionPlayInfo;
  }

  getFirstTuneSetPositionById(tuneSetId) {
    var tuneSet;

    tuneSet = this.getTuneSetById(tuneSetId);
    return tuneSet.extractFirstTuneSetPosition();
  }

  initializePartPlayInfo() {
      return new PartPlayInfo("","");
  }

  initializeTuneAndTuneSet(){
    // Get next tuneSetId, intTuneId and tuneId
    var maxTuneSetId = 0;
    var maxIntTuneId = 0;
    var maxTuneId = 0;
    var currentTuneId = 0;
    var currentIntTuneId = 0;
    var currentTuneSetId = 0;

    for (var i = 0; i < this.tuneSets.length; i++) {

      //currentTuneSetId = parseInt(this.tuneSets[i].tuneSetId);
      currentTuneSetId = this.tuneSets[i].tuneSetId;
      if (currentTuneSetId > maxTuneSetId){
        maxTuneSetId = currentTuneSetId;
      }

      for (var z = 0; z < this.tuneSets[i].tuneSetPositions.length; z++) {

        //currentIntTuneId = parseInt(this.tuneSets[i].tuneSetPositions[z].tune.intTuneId);
        currentIntTuneId = this.tuneSets[i].tuneSetPositions[z].tune.intTuneId;
        if (currentIntTuneId > maxIntTuneId){
          maxIntTuneId = currentIntTuneId;
        }

        //currentTuneId = parseInt(this.tuneSets[i].tuneSetPositions[z].tune.id);
        currentTuneId = this.tuneSets[i].tuneSetPositions[z].tune.intTuneId;
        if (currentTuneId > maxTuneId){
          maxTuneId = currentTuneId;
        }
      }
    }

    // Create new Tune with X: maxTuneId + 1 and T: New Tune
    var newTuneId = ++maxTuneId;
    var newTuneSetId = ++maxTuneSetId;
    var newIntTuneId = ++maxIntTuneId;

    var abc = "X:"+newTuneId+"\n" + "T:New Tune";
    var book = new ABCJS.TuneBook(abc);
    var tune = book.tunes[0];

    tune.intTuneId =  newIntTuneId;

    tune.initializeTuneViewFields();

    var tuneSet: TuneSet;
    var tuneSetPositions = [];
    var tuneSetPosition = new TuneSetPosition(newTuneSetId, tune, 1, "3x", "");
    tuneSetPositions.push(tuneSetPosition);
    tuneSet = new TuneSet(newTuneSetId, tune.title, tuneSetPositions);

    this.tuneSets.unshift(tuneSet);


    return tuneSet;
  }
  
  getTuneTypes():Array<string> {
    //Extract Types for TypeFilter
    let types:Array<string> = [];
    let addToTypeFilter = true;

    for (var i = 0; i < this.tuneSets.length; i++) {
        for (var c = 0; c < this.tuneSets[i].tuneSetPositions.length; c++) {
          addToTypeFilter = true;

          for (var z = 0; z < types.length; z++) {
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
    var keys = [];
    var addToKeyFilter = true;

    for (var i = 0; i < this.tuneSets.length; i++) {
      for (var c = 0; c < this.tuneSets[i].tuneSetPositions.length; c++) {
        addToKeyFilter = true;

        for (var z = 0; z < keys.length; z++) {
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
    var events = [];
    var addToEventFilter = true;

    for (var i = 0; i < this.playlists.length; i++) {
      addToEventFilter = true;

      for (var z = 0; z < events.length; z++) {
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
    var bands = [];
    var addToBandFilter = true;

    for (var i = 0; i < this.playlists.length; i++) {
      addToBandFilter = true;

      for (var z = 0; z < bands.length; z++) {
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
    var colors = [];
    var addToColorFilter = true;

    for (var i = 0; i < this.tuneSets.length; i++) {
      for (var c = 0; c < this.tuneSets[i].tuneSetPositions.length; c++) {
        addToColorFilter = true;

        for (var z = 0; z < colors.length; z++) {
          if (colors[z] == this.tuneSets[i].tuneSetPositions[c].tune.color) {
            addToColorFilter = false;
          }
        }

        if (addToColorFilter) {
          colors.push(this.tuneSets[i].tuneSetPositions[c].tune.color);
        }
      }
    }

    colors.unshift("All Colors");

    return colors;
  }

  
}
