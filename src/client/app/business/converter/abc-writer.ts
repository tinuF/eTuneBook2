import * as moment from 'moment';

import { getSystemProperties } from '../system.properties';
import { Tune, TuneSetPosition, Playlist, PlaylistPosition, TuneSetPositionPlayInfo, TuneBook} from '../model/index';
import { AbcExportSettings } from '../settings/index';

var systemProperties = getSystemProperties();

export function writeAbcHeader(tuneBook: TuneBook, abcOption: AbcExportSettings) {
    // Construct Header
    let abc: string;
    let playlist: Playlist;
    let playlistPosition: PlaylistPosition;
    let tuneSetPositionPlayInfos: Array<TuneSetPositionPlayInfo>;
    let tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;

    abc = '%abc-';
    abc += systemProperties.ABC_VERSION;
    abc += '\n';
    abc += 'I:abc-creator eTuneBook-';
    abc += systemProperties.VERSION;
    abc += '\n';

    if (abcOption.includeAtLeastOneEtbkDirective()) {
        abc += '%%etbk:bname ';
        abc += tuneBook.name;
        abc += '\n';
        abc += '%%etbk:bvers ';
        abc += tuneBook.version;
        abc += '\n';
        abc += '%%etbk:bdesc ';
        abc += tuneBook.description;
        abc += '\n';
    }

    if (abcOption.playlist) {
        for (let i = 0; i < tuneBook.playlists.length; i++) {
            //Playlist-Definition
            playlist = tuneBook.playlists[i];
            abc += '%%etbk:plldf id:';
            abc += playlist.id;
            abc += ',name:';
            abc += playlist.name;
            abc += ',evt:';
            abc += playlist.event;
            abc += ',band:';
            abc += playlist.band;
            abc += '\n';

            for (let z = 0; z < playlist.playlistPositions.length; z++) {
                //Playlist-Position
                playlistPosition = playlist.playlistPositions[z];
                abc += '%%etbk:pllps id:';
                abc += playlist.id;
                abc += ',pos:';
                abc += playlistPosition.position;
                abc += ',tnset:';
                abc += playlistPosition.tuneSet.id;
                abc += ',name:';
                abc += playlistPosition.name;
                abc += ',ant:';
                abc += playlistPosition.annotation;
                abc += '\n';

                tuneSetPositionPlayInfos = playlistPosition.tuneSetPositionPlayInfos;

                for (let y = 0; y < tuneSetPositionPlayInfos.length; y++) {
                    //TuneSetPositionPlayInfo
                    tuneSetPositionPlayInfo = tuneSetPositionPlayInfos[y];

                    if (!tuneSetPositionPlayInfo.isDefault()) {
                        abc += '%%etbk:plltp pll:';
                        abc += tuneSetPositionPlayInfo.playlistPosition.playlistId;
                        abc += ',pllpos:';
                        abc += tuneSetPositionPlayInfo.playlistPosition.position;
                        abc += ',tnset:';
                        abc += tuneSetPositionPlayInfo.tuneSetPosition.tuneSetId;
                        abc += ',tnsetpos:';
                        abc += tuneSetPositionPlayInfo.tuneSetPosition.position;
                        abc += ',rep:';
                        abc += tuneSetPositionPlayInfo.repeat;
                        abc += ',arr:{';

                        let firstPart = true;
                        for (let w = 0; w < tuneSetPositionPlayInfo.partPlayInfos.length; w++) {
                            //PartPlayInfos
                            if (firstPart) {
                                firstPart = false;
                            } else {
                                abc += ',';
                            }
                            abc += tuneSetPositionPlayInfo.partPlayInfos[w].part;
                            abc += ':';
                            abc += tuneSetPositionPlayInfo.partPlayInfos[w].playInfo;
                        }

                        abc += '},ant:';
                        abc += tuneSetPositionPlayInfo.annotation;
                        abc += '\n';
                    }
                }
            }
        }
    }

    abc += '\n';
    return abc;
}

export function writeTuneAbc(tune: Tune, tuneSetPositions: Array<TuneSetPosition>, abcOption: AbcExportSettings) {
    let tuneAbc = '';

    if (!abcOption.tuneSet && !abcOption.playDate && !abcOption.color && !abcOption.annotation && !abcOption.website && !abcOption.video) {
        tuneAbc = tune.pure;
    } else {
        tuneAbc = writeTuneAbcWithEtbkDirectives(tune, tuneSetPositions, 'X:', abcOption);
    }

    if (!abcOption.fingering) {
        tuneAbc = tuneAbc.replace(systemProperties.PATTERN_FINGER, '');
    }

    return tuneAbc;
}

export function writeTuneAbcWithEtbkDirectives(tune: Tune, tuneSetPositions: Array<TuneSetPosition>, targetLine: string, abcOption: AbcExportSettings) {
    let tuneSplits: Array<string> = [];
    let newAbc = '';
    tuneSplits = tune.pure.split('\n');
    let curLineIsTargetLine = false;
    let lastLineIsTargetLine = false;
    let directivesAdded = false;
    let directive = '';

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
                        directive = '%%etbk:tnset id:' + tuneSetPositions[w].tuneSetId + ',pos:'
                            + tuneSetPositions[w].position + ',rep:' + tuneSetPositions[w].repeat
                            + ',ant:' + tuneSetPositions[w].annotation;

                        newAbc = newAbc + directive;
                        newAbc = newAbc + '\n';
                    }
                }

                if (abcOption.website) {
                    for (let z = 0; z < tune.websites.length; z++) {
                        directive = '%%etbk:wsite ' + tune.websites[z].url;
                        newAbc = newAbc + directive;
                        newAbc = newAbc + '\n';
                    }
                }

                if (abcOption.video) {
                    for (let z = 0; z < tune.videos.length; z++) {
                        directive = '%%etbk:video '
                            + 'src:' + tune.videos[z].source
                            + ',cde:' + tune.videos[z].code
                            + ',desc:' + tune.videos[z].description;
                        newAbc = newAbc + directive;
                        newAbc = newAbc + '\n';
                    }
                }

                if (abcOption.annotation) {
                    if (tune.annotation != '') {
                        directive = '%%etbk:annot ' + tune.annotation;
                        newAbc = newAbc + directive;
                        newAbc = newAbc + '\n';
                    }
                }

                if (abcOption.color) {
                    if (tune.color.getHexValue() != systemProperties.DEFAULT_COLOR) {
                        directive = '%%etbk:color ' + tune.color.getHexValue();
                        newAbc = newAbc + directive;
                        newAbc = newAbc + '\n';
                    }
                }

                if (abcOption.playDate) {

                    if (tune.lastPlayed != null) {
                        directive = _getPlayDatesDirective(tune);
                        newAbc = newAbc + directive;
                        newAbc = newAbc + '\n';
                    }
                }
                directivesAdded = true;
            }
        }

        newAbc = newAbc + tuneSplits[i];
        newAbc = newAbc + '\n';

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
    let directive = '%%etbk:pldat ';
    let playDate: any = null;

    // Prepare PlayDatesDirective
    for (let i = 0; i < tune.playDates.length; i++) {
        if (i > 0) {
            directive = directive + ',';
        }
        playDate = moment(tune.playDates[i].date);
        directive = directive + playDate.format('YYYY-MM-DDTHH:mm');
    }

    return directive;
}
