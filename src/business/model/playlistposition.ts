import {TuneSet} from './tuneset';
import {TuneSetPositionPlayInfo} from './tunesetposition-playinfo';

export class PlaylistPosition {
    playlistId: number;
    position: number;
    tuneSet: TuneSet;
    name: string;
    annotation: string;
    tuneSetPositionPlayInfos: Array<TuneSetPositionPlayInfo>;

    constructor(playlistId: number, position: number, tuneSet: TuneSet, name: string, annotation: string) {
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

    setTuneSetPositionPlayInfos(tuneSetPositionPlayInfos: Array<TuneSetPositionPlayInfo>) {
        this.tuneSetPositionPlayInfos = tuneSetPositionPlayInfos;
    }

    deleteTune(tuneId: number) {
        let tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;

        for (let z = 0; z < this.tuneSetPositionPlayInfos.length; z++) {
            tuneSetPositionPlayInfo = this.tuneSetPositionPlayInfos[z];

            if (tuneSetPositionPlayInfo.tuneSetPosition.tune.id == tuneId) {
                // Remove TuneSetPositionPlayInfo from PlaylistPosition
                // TuneSetPositionPlayInfo will be deleted later by Garbage Collector
                this.tuneSetPositionPlayInfos.splice(z, 1);
            }
        }
    }
}
