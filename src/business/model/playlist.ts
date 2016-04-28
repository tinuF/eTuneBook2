import {PlaylistPosition} from './playlistposition';

export class Playlist {
    id: number;
    name: string;
    event: string;
    band: string;
    playlistPositions: Array<PlaylistPosition>;

    constructor(playlistId: number, playlistName: string, playlistEvent: string, playlistBand: string) {
        this.id = playlistId;
        this.name = playlistName;
        this.event = playlistEvent;
        this.band = playlistBand;
        this.playlistPositions = [];
    }

    addPlaylistPosition(playlistPosition: PlaylistPosition) {
        this.playlistPositions.push(playlistPosition);
    }

    getPlaylistPosition(position: number): PlaylistPosition {
        for (let i = 0; i < this.playlistPositions.length; i++) {
            if (position == this.playlistPositions[i].position) {
                return this.playlistPositions[i];
            }
        }
        return null;
    }

    getPlaylistPositionByTuneSetId(tuneSetId: number): PlaylistPosition {
        for (let i = 0; i < this.playlistPositions.length; i++) {
            if (tuneSetId == this.playlistPositions[i].tuneSet.id) {
                return this.playlistPositions[i];
            }
        }
        return null;
    }

    getPlaylistPositionAsNumbers(): Array<number> {
        let positions: Array<number> = [];

        for (let i = 0; i < this.playlistPositions.length; i++) {
            positions.push(this.playlistPositions[i].position);
        }

        return positions;
    }

    movePlaylistPosition(oldPosition: number, newPosition: number) {
        let movingPlaylistPosition: PlaylistPosition;

        //Change moving Playlist-Position
        for (let z = 0; z < this.playlistPositions.length; z++) {
            if (this.playlistPositions[z].position == oldPosition) {
                this.playlistPositions[z].position = newPosition;
                movingPlaylistPosition = this.playlistPositions[z];
            }
        }

        //Change Playlist-Positions between oldPosition and newPosition
        if (newPosition < oldPosition) {
            // moved down
            for (let y = 0; y < this.playlistPositions.length; y++) {
                if (this.playlistPositions[y].position >= newPosition && this.playlistPositions[y].position < oldPosition) {
                    if (this.playlistPositions[y] != movingPlaylistPosition) {
                        this.playlistPositions[y].position++;
                    }
                }
            }

        } else if (newPosition > oldPosition) {
            // moved up
            for (let y = 0; y < this.playlistPositions.length; y++) {
                if (this.playlistPositions[y].position <= newPosition && this.playlistPositions[y].position > oldPosition) {
                    if (this.playlistPositions[y] != movingPlaylistPosition) {
                        this.playlistPositions[y].position--;
                    }
                }
            }
        }

        // Sort PlaylistPositions by position
        this.playlistPositions.sort(function (a, b) {
            return a.position - b.position;
        });
    }

    deleteTune(tuneId: number) {
        let playlistPosition: PlaylistPosition;

        for (let y = 0; y < this.playlistPositions.length; y++) {
            playlistPosition = this.playlistPositions[y];

            playlistPosition.deleteTune(tuneId);

            if (playlistPosition.setTuneSetPositionPlayInfos.length == 0) {
                // Empty PlaylistPosition
                this.deletePlaylistPosition(playlistPosition.position);
            }
        }
    }

    deletePlaylistPosition(removedPosition: number) {
        let removedPlaylistPosition: PlaylistPosition;

        for (let z = 0; z < this.playlistPositions.length; z++) {
            if (this.playlistPositions[z].position == removedPosition) {
                removedPlaylistPosition = this.playlistPositions[z];
                // Delete playlistPosition from playlist
                this.playlistPositions.splice(z, 1);
                
                // Remove all TuneSetPositionPlayInfos from the removed PlaylistPosition
                removedPlaylistPosition.tuneSetPositionPlayInfos = [];
            }
        }

        if (this.playlistPositions.length > 0) {
            // playlist still has playlistPositions
            // Adjust Positions of remaining playlistPositions: Only necessary for playlistPositions that come after the removed playlistPosition

            this.adjustPositonAfterRemovedPlaylistPosition(removedPlaylistPosition);
        }
    }

    adjustPositonAfterRemovedPlaylistPosition(removedPlaylistPosition: PlaylistPosition) {
        let currentPosition = 0;

        for (let y = 0; y < this.playlistPositions.length; y++) {
            currentPosition = this.playlistPositions[y].position;

            if (currentPosition > removedPlaylistPosition.position) {
                currentPosition--;
                // Change Position on PlaylistPosition
                this.playlistPositions[y].position = currentPosition;
            }
        }
    }
}
