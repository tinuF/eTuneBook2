import { TuneSetPosition } from '../model/index';

export class TuneSet {
    id: number;
    tuneSetName: string;
    tuneSetPositions: Array<TuneSetPosition>;

    constructor(tuneSetId: number, tuneSetName: string, tuneSetPositions: Array<TuneSetPosition>) {
        this.id = tuneSetId;
        this.tuneSetName = tuneSetName;
        this.tuneSetPositions = tuneSetPositions;
    }

    getTuneSetPositionByPosition(position: number) {
        // Get TuneSetPosition from a TuneSet by position

        for (var z = 0; z < this.tuneSetPositions.length; z++) {
            if (this.tuneSetPositions[z].position == position) {
                return this.tuneSetPositions[z];
            }
        }
        return null;
    }

    getFirstTuneSetPosition() {
        // Extract First TuneSetPosition from a TuneSet.

        for (var z = 0; z < this.tuneSetPositions.length; z++) {
            if (this.tuneSetPositions[z].position == 1) {
                return this.tuneSetPositions[z];
            }
        }
        return null;
    }

    moveTuneSetPosition(oldPosition: number, newPosition: number) {
        //Change moving TuneSet-Position

        let movingTuneSetPosition: TuneSetPosition;

        for (var z = 0; z < this.tuneSetPositions.length; z++) {
            if (this.tuneSetPositions[z].position == oldPosition) {
                this.tuneSetPositions[z].position = newPosition;
                movingTuneSetPosition = this.tuneSetPositions[z];
            }
        }

        //Change TuneSet-Positions between oldPosition and newPosition
        if (newPosition < oldPosition) {
            // moved down
            for (var y = 0; y < this.tuneSetPositions.length; y++) {
                if (this.tuneSetPositions[y].position >= newPosition && this.tuneSetPositions[y].position < oldPosition) {
                    if (this.tuneSetPositions[y] != movingTuneSetPosition) {
                        this.tuneSetPositions[y].position++;
                    }
                }
            }

        } else if (newPosition > oldPosition) {
            // moved up
            for (var y = 0; y < this.tuneSetPositions.length; y++) {
                if (this.tuneSetPositions[y].position <= newPosition && this.tuneSetPositions[y].position > oldPosition) {
                    if (this.tuneSetPositions[y] != movingTuneSetPosition) {
                        this.tuneSetPositions[y].position--;
                    }
                }
            }
        }

        // Sort TuneSetPositions by position
        this.tuneSetPositions.sort(function (a, b) {
            return a.position - b.position;
        });
    }

    addPlayDate(newDate:Date) {
        for (var i = 0; i < this.tuneSetPositions.length; i++) {
            this.tuneSetPositions[i].tune.addPlayDate(newDate);
        }
    }

    getLastPlayDate(): Date {
        let lastPlayDate: Date;
        for (var i = 0; i < this.tuneSetPositions.length; i++) {
            if (lastPlayDate == undefined || this.tuneSetPositions[i].tune.lastPlayed > lastPlayDate) {
                lastPlayDate = this.tuneSetPositions[i].tune.lastPlayed;
            }
        }
        return lastPlayDate;
    }

    deleteTune(tuneId:number) {
        let removedTuneSetPosition:TuneSetPosition;
        
        removedTuneSetPosition = this.deleteTuneSetPositionByTuneId(tuneId);

        if (this.tuneSetPositions.length > 0) {
            // TuneSet still has TuneSetPositions
            // Adjust Positions of remaining TuneSetPositions: Only necessary for tunes that come after the removed tune
            this.adjustPositonAfterRemovedTuneSetPosition(removedTuneSetPosition);
        }        
    }
    
    deleteTuneSetPosition(position: number): TuneSetPosition {
        let tuneSetPosition: TuneSetPosition = null;

        for (let z = 0; z < this.tuneSetPositions.length; z++) {
            if (this.tuneSetPositions[z].position == position) {
                tuneSetPosition = this.tuneSetPositions[z];
                // Remove TuneSetPosition from TuneSet
                // TuneSetPosition will be deleted later by Garbage Collector
                this.tuneSetPositions.splice(z, 1);
            }
        }
        return tuneSetPosition;
    }
    
    deleteTuneSetPositionByTuneId(tuneId: number): TuneSetPosition {
        let tuneSetPosition: TuneSetPosition = null;

        for (var z = 0; z < this.tuneSetPositions.length; z++) {
            if (this.tuneSetPositions[z].tune.id == tuneId) {
                tuneSetPosition = this.tuneSetPositions[z];
                // Remove TuneSetPosition from TuneSet
                // TuneSetPosition will be deleted later by Garbage Collector
                this.tuneSetPositions.splice(z, 1);
            }
        }
        return tuneSetPosition;
    }

    adjustPositonAfterRemovedTuneSetPosition(removedTuneSetPosition: TuneSetPosition) {
        let currentPosition = 0;

        for (var y = 0; y < this.tuneSetPositions.length; y++) {
            currentPosition = this.tuneSetPositions[y].position;

            if (currentPosition > removedTuneSetPosition.position) {
                currentPosition--;
                // Change Position on TuneSetPosition
                this.tuneSetPositions[y].position = currentPosition;
            }
        }
    }
}
