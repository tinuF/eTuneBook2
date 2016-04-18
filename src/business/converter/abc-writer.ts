import * as moment from 'moment';
import {getSystemProperties} from '../../common/system-properties';
import {Tune} from '../model/tune';
import {TuneSetPosition} from '../model/tunesetposition';
import {Playlist} from '../model/playlist';
import {PlaylistPosition} from '../model/playlistposition';
import {TuneSetPositionPlayInfo} from '../model/tunesetposition-playinfo';
import {TuneBook} from '../model/tunebook';
import {AbcExportSettings} from '../../common/settings/abc-export-settings';

var systemProperties = getSystemProperties();

export function writeAbcHeader(tuneBook: TuneBook, abcOption: AbcExportSettings) {
    // Construct Header
    let tbkAbc: string;
    let playlist: Playlist;
    let playlistPosition: PlaylistPosition;
    let tuneSetPositionPlayInfos: Array<TuneSetPositionPlayInfo>;
    let tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;

    tbkAbc = "%abc-";
    tbkAbc += systemProperties.ABC_VERSION;
    tbkAbc += "\n";
    tbkAbc += "I:abc-creator eTuneBook-";
    tbkAbc += systemProperties.VERSION;
    tbkAbc += "\n";

    if (abcOption.includeAtLeastOneEtbkDirective()) {
        tbkAbc += "%%etbk:bname ";
        tbkAbc += tuneBook.name;
        tbkAbc += "\n";
        tbkAbc += "%%etbk:bvers ";
        tbkAbc += tuneBook.version;
        tbkAbc += "\n";
        tbkAbc += "%%etbk:bdesc ";
        tbkAbc += tuneBook.description;
        tbkAbc += "\n";
    }

    if (abcOption.playlist) {
        for (let i = 0; i < tuneBook.playlists.length; i++) {
            //Playlist-Definition
            playlist = tuneBook.playlists[i];
            tbkAbc += "%%etbk:plldf id:";
            tbkAbc += playlist.id;
            tbkAbc += ",name:";
            tbkAbc += playlist.name;
            tbkAbc += ",evt:";
            tbkAbc += playlist.event;
            tbkAbc += ",band:";
            tbkAbc += playlist.band;
            tbkAbc += "\n";

            for (let z = 0; z < playlist.playlistPositions.length; z++) {
                //Playlist-Position
                playlistPosition = playlist.playlistPositions[z];
                tbkAbc += "%%etbk:pllps id:";
                tbkAbc += playlist.id;
                tbkAbc += ",pos:";
                tbkAbc += playlistPosition.position;
                tbkAbc += ",tnset:";
                tbkAbc += playlistPosition.tuneSet.tuneSetId;
                tbkAbc += ",name:";
                tbkAbc += playlistPosition.name;
                tbkAbc += ",ant:";
                tbkAbc += playlistPosition.annotation;
                tbkAbc += "\n";

                tuneSetPositionPlayInfos = playlistPosition.tuneSetPositionPlayInfos;

                for (let y = 0; y < tuneSetPositionPlayInfos.length; y++) {
                    //TuneSetPositionPlayInfo
                    tuneSetPositionPlayInfo = tuneSetPositionPlayInfos[y];

                    if (!tuneSetPositionPlayInfo.isDefault()) {
                        tbkAbc += "%%etbk:plltp pll:";
                        tbkAbc += tuneSetPositionPlayInfo.playlistPosition.playlistId;
                        tbkAbc += ",pllpos:";
                        tbkAbc += tuneSetPositionPlayInfo.playlistPosition.position;
                        tbkAbc += ",tnset:";
                        tbkAbc += tuneSetPositionPlayInfo.tuneSetPosition.tuneSetId;
                        tbkAbc += ",tnsetpos:";
                        tbkAbc += tuneSetPositionPlayInfo.tuneSetPosition.position;
                        tbkAbc += ",rep:";
                        tbkAbc += tuneSetPositionPlayInfo.repeat;
                        tbkAbc += ",arr:{";

                        let firstPart = true;
                        for (let w = 0; w < tuneSetPositionPlayInfo.partPlayInfos.length; w++) {
                            //PartPlayInfos
                            if (firstPart) {
                                firstPart = false;
                            } else {
                                tbkAbc += ",";
                            }
                            tbkAbc += tuneSetPositionPlayInfo.partPlayInfos[w].part;
                            tbkAbc += ":";
                            tbkAbc += tuneSetPositionPlayInfo.partPlayInfos[w].playInfo;
                        }

                        tbkAbc += "},ant:";
                        tbkAbc += tuneSetPositionPlayInfo.annotation;
                        tbkAbc += "\n";
                    }
                }
            }
        }
    }

    tbkAbc += "\n";
    return tbkAbc;
}

export function writeTuneAbc(tune: Tune, tuneSetPositions: Array<TuneSetPosition>, abcOption: AbcExportSettings) {
    let tuneAbc = "";

    if (!abcOption.tuneSet && !abcOption.playDate && !abcOption.color && !abcOption.annotation && !abcOption.website && !abcOption.video) {
        tuneAbc = tune.pure;
    } else {
        tuneAbc = writeTuneAbcWithEtbkDirectives(tune, tuneSetPositions, "X:", abcOption);
    }

    if (!abcOption.fingering) {
        tuneAbc = tuneAbc.replace(systemProperties.PATTERN_FINGER, '');
    }

    return tuneAbc;
}

export function writeTuneAbcWithEtbkDirectives(tune: Tune, tuneSetPositions: Array<TuneSetPosition>, targetLine: string, abcOption: AbcExportSettings) {
    let tuneSplits: Array<string> = [];
    let newAbc = "";
    tuneSplits = tune.pure.split("\n");
    let curLineIsTargetLine = false;
    let lastLineIsTargetLine = false;
    let directivesAdded = false;
    let directive = "";

    // Add all directives after the TargetLine
    for (let i = 0; i < tuneSplits.length; i++) {
        if (!directivesAdded) {
            if (tuneSplits[i].indexOf(targetLine) !== -1) {
                curLineIsTargetLine = true;
            } else {
                curLineIsTargetLine = false;
            }

            if (!curLineIsTargetLine && lastLineIsTargetLine) {
                if (abcOption.tuneSet) {
                    for (let w = 0; w < tuneSetPositions.length; w++) {
                        directive = "%%etbk:tnset id:" + tuneSetPositions[w].tuneSetId + ",pos:"
                            + tuneSetPositions[w].position + ",rep:" + tuneSetPositions[w].repeat
                            + ",ant:" + tuneSetPositions[w].annotation;

                        newAbc = newAbc + directive;
                        newAbc = newAbc + "\n";
                    }
                }

                if (abcOption.website) {
                    for (let z = 0; z < tune.websites.length; z++) {
                        directive = "%%etbk:wsite " + tune.websites[z].url;
                        newAbc = newAbc + directive;
                        newAbc = newAbc + "\n";
                    }
                }

                if (abcOption.video) {
                    for (let z = 0; z < tune.videos.length; z++) {
                        directive = "%%etbk:video "
                            + "src:" + tune.videos[z].source
                            + ",cde:" + tune.videos[z].code
                            + ",desc:" + tune.videos[z].description;
                        newAbc = newAbc + directive;
                        newAbc = newAbc + "\n";
                    }
                }

                if (abcOption.annotation) {
                    if (tune.annotation != "") {
                        directive = "%%etbk:annot " + tune.annotation;
                        newAbc = newAbc + directive;
                        newAbc = newAbc + "\n";
                    }
                }

                if (abcOption.color) {
                    if (tune.color.getHexValue() != systemProperties.DEFAULT_COLOR) {
                        directive = "%%etbk:color " + tune.color.getHexValue();
                        newAbc = newAbc + directive;
                        newAbc = newAbc + "\n";
                    }
                }

                if (abcOption.playDate) {

                    if (tune.lastPlayed != null) {
                        directive = _getPlayDatesDirective(tune);
                        newAbc = newAbc + directive;
                        newAbc = newAbc + "\n";
                    }
                }
                directivesAdded = true;
            }
        }

        newAbc = newAbc + tuneSplits[i];
        newAbc = newAbc + "\n";

        lastLineIsTargetLine = curLineIsTargetLine;
    }

    // EOF (tune consists only of the TargetLine or no TargetLine was found)
    // Todo: Add it at the end
    if (!directivesAdded) {
        // todo
    }

    return newAbc;
}

function _getPlayDatesDirective(tune: Tune) {
    let directive = "%%etbk:pldat ";
    let playDate: any = null;

    // Prepare PlayDatesDirective
    for (let i = 0; i < tune.playDates.length; i++) {
        if (i > 0) {
            directive = directive + ",";
        }
        playDate = moment(tune.playDates[i].date);
        directive = directive + playDate.format("YYYY-MM-DDTHH:mm");
    }

    return directive;
}
