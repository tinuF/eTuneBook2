import {Tune} from './tune';
import {TuneSetPositionPlayInfo} from './tunesetposition-playinfo';

export class TuneSetPosition {
  tuneSetId: number;
  tune: Tune;
  position: number;
  repeat: string;
  annotation: string;
  currentTuneSetPositionPlayInfo:TuneSetPositionPlayInfo; //TODO refactor

  constructor(tuneSetId, tune, position, repeat, annotation) {
    this.tuneSetId = tuneSetId;
    this.tune = tune;
    this.position = position;
    this.repeat = repeat;
    this.annotation = annotation;
  }
}
