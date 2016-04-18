import {Playlist} from '../model/playlist';
import {PlaylistPosition} from '../model/playlistposition';
import {TuneSetPositionPlayInfo} from '../model/tunesetposition-playinfo';
import {PartPlayInfo} from '../model/partplayinfo';
import {TuneSet} from '../model/tuneset';
import {TuneSetPosition} from '../model/tunesetposition';
import {TuneBook} from '../model/tuneBook';
import {getAbcValues, getSubDirective} from '../util/abc-util';
import {eliminateThe} from '../util/text-util';

export function importPlaylists(header: string): Array<Playlist> {
    // Generate Playlists from the book.
    let playlistDefinitionDirectives: Array<string> = getAbcValues(header, "%%etbk:plldf ");
    let playlistId: number;
    let playlistName: string;
    let playlistEvent: string;
    let playlistBand: string;
    let playlist: Playlist;
    let playlists: Array<Playlist> = [];

    if (playlistDefinitionDirectives.length > 0) {
        for (let y = 0; y < playlistDefinitionDirectives.length; y++) {
            // Get Playlist Definition
            playlistId = importPlaylistId(playlistDefinitionDirectives[y]);
            playlistName = importPlaylistName(playlistDefinitionDirectives[y]);
            playlistEvent = importPlaylistEvent(playlistDefinitionDirectives[y]);
            playlistBand = importPlaylistBand(playlistDefinitionDirectives[y]);

            // Generate Playlist
            playlist = new Playlist(playlistId, playlistName, playlistEvent, playlistBand);
            playlists.push(playlist);
        }
    }

    return playlists;
}

export function importPlaylistPositions(tuneBook: TuneBook) {
    // Generate PlaylistPositions from the book.
    let playlistPositionDirectives: Array<string> = getAbcValues(tuneBook.header, "%%etbk:pllps ");
    let playlistId: number;
    let position: number;
    let tuneSetId: number;
    let name: string;
    let annotation: string;
    let tuneSet: TuneSet = tuneBook.getTuneSetById(tuneSetId);

    if (playlistPositionDirectives.length > 0) {
        for (let z = 0; z < playlistPositionDirectives.length; z++) {
            // Get Playlist Positions
            playlistId = importPlaylistId(playlistPositionDirectives[z]);
            position = importPlaylistPositionPosition(playlistPositionDirectives[z]);
            tuneSetId = importPlaylistPositionTuneSetId(playlistPositionDirectives[z]);
            name = importPlaylistPositionName(playlistPositionDirectives[z]);
            annotation = importPlaylistPositionAnnotation(playlistPositionDirectives[z]);
            tuneSet = tuneBook.getTuneSetById(tuneSetId);

            if (name === "") {
                //Default-Name of PlaylistPosition = Name of TuneSet = Name of first tune
                name = eliminateThe(tuneSet.tuneSetName);
                name += " Set";
            }

            // Generate PlaylistPosition
            let playlistPosition = new PlaylistPosition(playlistId, position, tuneSet, name, annotation);

            // Add PlaylistPosition to Playlist
            let playlist = tuneBook.getPlaylistById(playlistId);
            playlist.addPlaylistPosition(playlistPosition);
        }
    }
}

export function importTuneSetPositionPlayInfos(tuneBook: TuneBook) {
    // Generate TuneSetPositionPlayInfos from the book.
    let tuneSetPositionPlayInfoDirectives: Array<string> = getAbcValues(tuneBook.header, "%%etbk:plltp ");
    let playlistId: number;
    let playlistPositionNr: number;
    let tuneSetId: number;
    let tuneSetPositionNr: number;
    let repeat: string;
    let partPlayInfoDirective: string;
    let annotation: string;
    let partPlayInfos: Array<PartPlayInfo>;
    let playlistPosition: PlaylistPosition;
    let tuneSetPosition: TuneSetPosition;
    let tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;
    let tuneSetPositionPlayInfos: Array<TuneSetPositionPlayInfo> = [];

    if (tuneSetPositionPlayInfoDirectives.length > 0) {
        for (let z = 0; z < tuneSetPositionPlayInfoDirectives.length; z++) {
            // Get TuneSetSetPositionPlayInfo
            playlistId = parseInt(getSubDirective(tuneSetPositionPlayInfoDirectives[z], "pll:", ","));
            playlistPositionNr = parseInt(getSubDirective(tuneSetPositionPlayInfoDirectives[z], "pllpos:", ","));
            tuneSetId = parseInt(getSubDirective(tuneSetPositionPlayInfoDirectives[z], "tnset:", ","));
            tuneSetPositionNr = parseInt(getSubDirective(tuneSetPositionPlayInfoDirectives[z], "tnsetpos:", ","));
            repeat = getSubDirective(tuneSetPositionPlayInfoDirectives[z], "rep:", ",");
            partPlayInfoDirective = getSubDirective(tuneSetPositionPlayInfoDirectives[z], "arr:{", "}");
            partPlayInfos = importPartPlayInfos(partPlayInfoDirective);
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

function importPartPlayInfos(partPlayInfoDirective: string) {
    let partPlayInfosSplits: Array<string>;
    let partPlayInfoSplits: Array<string>;
    let part: string;
    let playInfo: string;
    let partPlayInfos: Array<PartPlayInfo>;
    let partPlayInfo: PartPlayInfo;

    partPlayInfosSplits = partPlayInfoDirective.split(",");
    partPlayInfos = [];

    if (partPlayInfosSplits.length > 0) {
        for (let z = 0; z < partPlayInfosSplits.length; z++) {
            // Get PartPlayInfo
            partPlayInfoSplits = partPlayInfosSplits[z].split(":");

            if (partPlayInfoSplits.length === 2) {
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

function importPlaylistId(playlistDirective: string): number {
    return parseInt(getSubDirective(playlistDirective, "id:", ","));
}

function importPlaylistName(playlistDirective: string): string {
    return getSubDirective(playlistDirective, "name:", ",");
}

function importPlaylistEvent(playlistDirective: string): string {
    return getSubDirective(playlistDirective, "evt:", ",");
}

function importPlaylistBand(playlistDirective: string): string {
    return getSubDirective(playlistDirective, "band:", ",");
}

function importPlaylistPositionPosition(playlistDirective: string): number {
    return parseInt(getSubDirective(playlistDirective, "pos:", ","));
}

function importPlaylistPositionTuneSetId(playlistDirective: string): number {
    return parseInt(getSubDirective(playlistDirective, "tnset:", ","));
}

function importPlaylistPositionName(playlistDirective: string): string {
    return getSubDirective(playlistDirective, "name:", ",");
}

function importPlaylistPositionAnnotation(playlistDirective: string): string {
    return getSubDirective(playlistDirective, "ant:", ",");
}
