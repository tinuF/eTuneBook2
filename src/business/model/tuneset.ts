import {TuneSetPosition} from './tunesetposition';

export class TuneSet {
    tuneSetId: number;
    tuneSetName: string;
    tuneSetPositions: Array<TuneSetPosition>;

    constructor(tuneSetId, tuneSetName, tuneSetPositions) {
        this.tuneSetId = tuneSetId;
        this.tuneSetName = tuneSetName;
        this.tuneSetPositions = tuneSetPositions;
    }

    getTuneSetPositionByPosition(position) {
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

        let movingTuneSetPosition;

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
        this.tuneSetPositions.sort(function(a, b) {
            return a.position - b.position;
        });
    }

    addPlayDate(newDate) {
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
}
