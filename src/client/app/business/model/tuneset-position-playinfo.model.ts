import {PlaylistPosition, TuneSetPosition, PartPlayInfo} from '../model/index';

export class TuneSetPositionPlayInfo {
  playlistPosition: PlaylistPosition;
  tuneSetPosition: TuneSetPosition;
  repeat: string;
  partPlayInfos: Array<PartPlayInfo>;
  annotation: string;

  constructor(playlistPosition: PlaylistPosition, tuneSetPosition: TuneSetPosition,
    repeat: string, partPlayInfos: Array<PartPlayInfo>, annotation: string) {
    this.playlistPosition = playlistPosition;
    this.tuneSetPosition = tuneSetPosition;
    this.repeat = repeat;
    this.partPlayInfos = partPlayInfos;
    this.annotation = annotation;
  }

  addPartPlayInfo(partPlayInfo: PartPlayInfo) {
    this.partPlayInfos.push(partPlayInfo);
  }

  addPartPlayInfoBefore(newPartPlayInfo: PartPlayInfo, oldPartPlayInfo: PartPlayInfo) {
    let index = this.partPlayInfos.indexOf(oldPartPlayInfo);

    // Insert new PartPlayInfo before old PartPlayInfo
    this.partPlayInfos.splice(index, 0, newPartPlayInfo);
  }

  addPartPlayInfoAfter(newPartPlayInfo: PartPlayInfo, oldPartPlayInfo: PartPlayInfo) {
    let index = this.partPlayInfos.indexOf(oldPartPlayInfo);

    // Insert new PartPlayInfo after old PartPlayInfo
    this.partPlayInfos.splice(index + 1, 0, newPartPlayInfo);
  }

  deletePartPlayInfo(partPlayInfo: PartPlayInfo) {
    this.partPlayInfos.splice(this.partPlayInfos.indexOf(partPlayInfo), 1);
  }

  moveUpPartPlayInfo(partPlayInfo: PartPlayInfo) {
    let index = this.partPlayInfos.indexOf(partPlayInfo);
    if (index == 0) {
      // First Position. Can't move up. Do nothing.
    } else {
      // Remove PartPlayInfo from old place
      this.partPlayInfos.splice(index, 1);
      // Insert PartPlayInfo into new place
      this.partPlayInfos.splice(index - 1, 0, partPlayInfo);
    }
  }

  moveDownPartPlayInfo(partPlayInfo: PartPlayInfo) {
    let index = this.partPlayInfos.indexOf(partPlayInfo);
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
    let isDefault = true;

    if (this.repeat != this.tuneSetPosition.repeat ||
      this.annotation != this.tuneSetPosition.annotation ||
      this.partPlayInfos.length > 0) {
      isDefault = false;
    }
    return isDefault;
  }
}
