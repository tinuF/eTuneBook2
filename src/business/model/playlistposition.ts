import {TuneSet} from './tuneset';
import {TuneSetPositionPlayInfo} from './tunesetposition-playinfo';

export class PlaylistPosition {
    playlistId: number;
    position: number;
    tuneSet: TuneSet;
    name: string;
    annotation: string;
    tuneSetPositionPlayInfos: Array<TuneSetPositionPlayInfo>;

    constructor(playlistId, position, tuneSet, name, annotation) {
        this.playlistId = playlistId;
        this.position = position;
        this.tuneSet = tuneSet;
        this.name = name;
        this.annotation = annotation;
        this.tuneSetPositionPlayInfos = [];
    }

    addTuneSetPositionPlayInfo(tuneSetPositionPlayInfo: TuneSetPositionPlayInfo) {
        this.tuneSetPositionPlayInfos.push(tuneSetPositionPlayInfo);
    }
}
