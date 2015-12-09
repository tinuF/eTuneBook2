import {Tune} from './tune';

export class TuneSetPosition {
  tuneSetId: number;
  tune: Tune;
  position: string;
  repeat: string;
  annotation: string;

  constructor(tuneSetId, tune, position, repeat, annotation) {
    this.tuneSetId = tuneSetId;
    this.tune = tune;
    this.position = position;
    this.repeat = repeat;
    this.annotation = annotation;
  }
}
