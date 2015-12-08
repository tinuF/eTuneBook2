import {PlaylistPosition} from './playlistposition';
import {TuneSetPosition} from './tunesetposition';
import {PartPlayInfo} from './partplayinfo';

export class TuneSetPositionPlayInfo {
  playlistPosition: PlaylistPosition;
  tuneSetPosition: TuneSetPosition;
  repeat: number;
  partPlayInfos: Array<PartPlayInfo>;
  annotation: string;

  constructor(playlistPosition, tuneSetPosition, repeat, partPlayInfos, annotation) {
    this.playlistPosition = playlistPosition;
    this.tuneSetPosition = tuneSetPosition;
    this.repeat = repeat;
    this.partPlayInfos = partPlayInfos;
    this.annotation = annotation;
  }

  addPartPlayInfo(partPlayInfo) {
    this.partPlayInfos.push(partPlayInfo);
  }

  addPartPlayInfoBefore(newPartPlayInfo, oldPartPlayInfo) {
    var index = this.partPlayInfos.indexOf(oldPartPlayInfo);
    
    // Insert new PartPlayInfo before old PartPlayInfo
    this.partPlayInfos.splice(index, 0, newPartPlayInfo);
  }

  addPartPlayInfoAfter(newPartPlayInfo, oldPartPlayInfo) {
    var index = this.partPlayInfos.indexOf(oldPartPlayInfo);
    
    // Insert new PartPlayInfo after old PartPlayInfo
    this.partPlayInfos.splice(index + 1, 0, newPartPlayInfo);
  }

  deletePartPlayInfo(partPlayInfo) {
    this.partPlayInfos.splice(this.partPlayInfos.indexOf(partPlayInfo), 1);
  }

  moveUpPartPlayInfo(partPlayInfo) {
    var index = this.partPlayInfos.indexOf(partPlayInfo);
    if (index == 0) {
      // First Position. Can't move up. Do nothing.
    } else {
      // Remove PartPlayInfo from old place
      this.partPlayInfos.splice(index, 1);
      // Insert PartPlayInfo into new place
      this.partPlayInfos.splice(index - 1, 0, partPlayInfo);
    }
  }

  moveDownPartPlayInfo(partPlayInfo) {
    var index = this.partPlayInfos.indexOf(partPlayInfo);
    if (index == this.partPlayInfos.length) {
      // Last Position. Can't move down. Do nothing.
    } else {
      // Remove PartPlayInfo from old place
      this.partPlayInfos.splice(index, 1);
      // Insert PartPlayInfo into new place
      this.partPlayInfos.splice(index + 1, 0, partPlayInfo);
    }
  }

  isDefault() {
    var isDefault = true;

    if (this.repeat != this.tuneSetPosition.repeat ||
      this.annotation != this.tuneSetPosition.annotation ||
      this.partPlayInfos.length > 0) {
      isDefault = false;
    }
    return isDefault;
  }
}
