import {TuneSetPosition} from './tunesetposition';

export class TuneSet {
  tuneSetId: number;
  tuneSetName: string;
  tuneSetPositions: Array<TuneSetPosition> ;

  constructor(tuneSetId, tuneSetName, tuneSetPositions) {
    this.tuneSetId = tuneSetId;
    this.tuneSetName = tuneSetName;
    this.tuneSetPositions = tuneSetPositions;
  }

  getTuneSetPositionByPosition(position){
      // Get TuneSetPosition from a TuneSet by position

      for (var z = 0; z < this.tuneSetPositions.length; z++) {
          if (this.tuneSetPositions[z].position == position){
              return this.tuneSetPositions[z];
          }
      }
  }

  getFirstTuneSetPosition(){
      // Extract First TuneSetPosition from a TuneSet.

      for (var z = 0; z < this.tuneSetPositions.length; z++) {
          if (this.tuneSetPositions[z].position == "1"){
              return this.tuneSetPositions[z];
          }
      }
  }

  addPlayDate(newDate){
    for (var i = 0; i < this.tuneSetPositions.length; i++) {
      this.tuneSetPositions[i].tune.addPlayDate(newDate);
    }
  }
  
  getLastPlayDate():Date{
    let lastPlayDate: Date;
    for (var i = 0; i < this.tuneSetPositions.length; i++) {
      if (lastPlayDate == undefined || this.tuneSetPositions[i].tune.lastPlayed > lastPlayDate) {
        lastPlayDate = this.tuneSetPositions[i].tune.lastPlayed;  
      } 
    }
    return lastPlayDate;
  }
}
