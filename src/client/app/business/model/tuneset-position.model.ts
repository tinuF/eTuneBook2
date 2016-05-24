import { Tune, TuneSetPositionPlayInfo } from '../model/index';

export class TuneSetPosition {
  tuneSetId: number;
  tune: Tune;
  position: number;
  repeat: string;
  annotation: string;
  tuneSetPositionPlayInfos: Array<TuneSetPositionPlayInfo>;

  constructor(tuneSetId: number, tune: Tune, position: number, repeat: string, annotation: string) {
    this.tuneSetId = tuneSetId;
    this.tune = tune;
    this.position = position;
    this.repeat = repeat;
    this.annotation = annotation;
    this.tuneSetPositionPlayInfos = [];
  }

  addTuneSetPositionPlayInfo(tuneSetPositionPlayInfo: TuneSetPositionPlayInfo) {
    this.tuneSetPositionPlayInfos.push(tuneSetPositionPlayInfo);
  }
}
