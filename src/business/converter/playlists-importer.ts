import {Playlist} from '../model/playlist';
import {PlaylistPosition} from '../model/playlistposition';
import {TuneSetPositionPlayInfo} from '../model/tunesetposition-playinfo';
import {PartPlayInfo} from '../model/partplayinfo';
import {TuneBook} from '../model/tuneBook';
import {getAbcValues, getSubDirective} from '../util/abc-util';
import {eliminateThe} from '../util/text-util';

export function importPlaylists(header){
    // Generate Playlists from the book.
    var playlists, playlistDefinitionDirectives;

    playlists = [];
    playlistDefinitionDirectives = getAbcValues(header, "%%etbk:plldf ");

    if (playlistDefinitionDirectives.length > 0){
        for (var y = 0; y < playlistDefinitionDirectives.length; y++) {
            // Get Playlist Definition
            var playlistId = _importPlaylistId(playlistDefinitionDirectives[y]);
            var playlistName = _importPlaylistName(playlistDefinitionDirectives[y]);
            var playlistEvent = _importPlaylistEvent(playlistDefinitionDirectives[y]);
            var playlistBand = _importPlaylistBand(playlistDefinitionDirectives[y]);

            // Generate Playlist
            var playlist: Playlist;
            playlist = new Playlist(playlistId, playlistName, playlistEvent, playlistBand);
            playlists.push(playlist);
        }
    }

   return playlists;
}

export function importPlaylistPositions(tuneBook){
    // Generate PlaylistPositions from the book.
    var playlistPositionDirectives;

    playlistPositionDirectives = getAbcValues(tuneBook.header, "%%etbk:pllps ");

    if (playlistPositionDirectives.length > 0){
        for (var z = 0; z < playlistPositionDirectives.length; z++) {
            // Get Playlist Positions
            var playlistId = _importPlaylistId(playlistPositionDirectives[z]);
            var position = _importPlaylistPositionPosition(playlistPositionDirectives[z]);
            var tuneSetId = _importPlaylistPositionTuneSetId(playlistPositionDirectives[z]);
            var name = _importPlaylistPositionName(playlistPositionDirectives[z]);
            var annotation = _importPlaylistPositionAnnotation(playlistPositionDirectives[z]);
            var tuneSet = tuneBook.getTuneSetById(tuneSetId);

            if(name == "") {
                //Default-Name of PlaylistPosition = Name of TuneSet = Name of first tune
                name = eliminateThe(tuneSet.tuneSetName);
                name += " Set";
            }

            // Generate PlaylistPosition
            var playlistPosition = new PlaylistPosition(playlistId, position, tuneSet, name, annotation);

            // Add PlaylistPosition to Playlist
            var playlist = tuneBook.getPlaylistById(playlistId);
            playlist.addPlaylistPosition(playlistPosition);
        }
    }
}

export function importTuneSetPositionPlayInfos(tuneBook){
    // Generate TuneSetPositionPlayInfos from the book.
    var tuneSetPositionPlayInfoDirectives, playlistId, playlistPositionNr, tuneSetId,
        tuneSetPositionNr, repeat, partPlayInfoDirective, annotation, partPlayInfos,
        tuneSetPositionPlayInfo, playlistPosition, tuneSetPosition,
        tuneSetPositionPlayInfos;

    tuneSetPositionPlayInfoDirectives = getAbcValues(tuneBook.header, "%%etbk:plltp ");

    tuneSetPositionPlayInfos = [];

    if (tuneSetPositionPlayInfoDirectives.length > 0){
        for (var z = 0; z < tuneSetPositionPlayInfoDirectives.length; z++) {
            // Get TuneSetSetPositionPlayInfo
            playlistId = getSubDirective(tuneSetPositionPlayInfoDirectives[z], "pll:", ",");
            playlistPositionNr = getSubDirective(tuneSetPositionPlayInfoDirectives[z], "pllpos:", ",");
            tuneSetId = getSubDirective(tuneSetPositionPlayInfoDirectives[z], "tnset:", ",");
            tuneSetPositionNr = getSubDirective(tuneSetPositionPlayInfoDirectives[z], "tnsetpos:", ",");
            repeat = getSubDirective(tuneSetPositionPlayInfoDirectives[z], "rep:", ",");
            partPlayInfoDirective = getSubDirective(tuneSetPositionPlayInfoDirectives[z], "arr:{", "}");
            partPlayInfos = _importPartPlayInfos(partPlayInfoDirective);
            annotation = getSubDirective(tuneSetPositionPlayInfoDirectives[z], "ant:", ",");
            playlistPosition = tuneBook.getPlaylistPosition(playlistId, playlistPositionNr);
            tuneSetPosition = playlistPosition.tuneSet.getTuneSetPositionByPosition(tuneSetPositionNr);

            // Generate tuneSetPositionPlayInfo
            tuneSetPositionPlayInfo = new TuneSetPositionPlayInfo(playlistPosition, tuneSetPosition, repeat, partPlayInfos, annotation);
            tuneSetPositionPlayInfos.push(tuneSetPositionPlayInfo);
        }
    }

    return tuneSetPositionPlayInfos;
}

function _importPartPlayInfos(partPlayInfoDirective){
  var partPlayInfosSplits, partPlayInfoSplits, part, playInfo, partPlayInfos, partPlayInfo;

  partPlayInfosSplits = partPlayInfoDirective.split(",");
  partPlayInfos = [];

  if (partPlayInfosSplits.length > 0){
    for (var z = 0; z < partPlayInfosSplits.length; z++) {
      // Get PartPlayInfo
      partPlayInfoSplits = partPlayInfosSplits[z].split(":");

      if (partPlayInfoSplits.length == 2){
        part = partPlayInfoSplits[0];
        playInfo = partPlayInfoSplits[1];

        // Generate partPlayInfo
        partPlayInfo = new PartPlayInfo(part, playInfo);
        partPlayInfos.push(partPlayInfo);
      }
    }
  }
  return partPlayInfos;
}

function _importPlaylistId(playlistDirective){
    return getSubDirective(playlistDirective, "id:", ",");
}

function _importPlaylistName(playlistDirective){
    return getSubDirective(playlistDirective, "name:", ",");
}

function _importPlaylistEvent(playlistDirective){
    return getSubDirective(playlistDirective, "evt:", ",");
}

function _importPlaylistBand(playlistDirective){
    return getSubDirective(playlistDirective, "band:", ",");
}

function _importPlaylistPositionPosition(playlistDirective){
    return getSubDirective(playlistDirective, "pos:", ",");
}

function _importPlaylistPositionTuneSetId(playlistDirective){
    return getSubDirective(playlistDirective, "tnset:", ",");
}

function _importPlaylistPositionName(playlistDirective){
    return getSubDirective(playlistDirective, "name:", ",");
}

function _importPlaylistPositionAnnotation(playlistDirective){
    return getSubDirective(playlistDirective, "ant:", ",");
}
