import {TuneSet} from './tuneset';

export class PlaylistPosition {
  playlistId: number;
  position: number;
  tuneSet: TuneSet;
  name: string;
  annotation: string;

  constructor(playlistId, position, tuneSet, name, annotation) {
    this.playlistId = playlistId;
    this.position = position;
    this.tuneSet = tuneSet;
    this.name = name;
    this.annotation = annotation;
  }
}
