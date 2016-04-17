import {PlaylistPosition} from './playlistposition';

export class Playlist {
    id: number;
    name: string;
    event: string;
    band: string;
    playlistPositions: Array<PlaylistPosition>;

    constructor(playlistId:number, playlistName:string, playlistEvent:string, playlistBand:string) {
        this.id = playlistId;
        this.name = playlistName;
        this.event = playlistEvent;
        this.band = playlistBand;
        this.playlistPositions = [];
    }

    addPlaylistPosition(playlistPosition:PlaylistPosition) {
        this.playlistPositions.push(playlistPosition);
    }

    getPlaylistPosition(position:number) {
        for (var i = 0; i < this.playlistPositions.length; i++) {
            if (position == this.playlistPositions[i].position) {
                return this.playlistPositions[i];
            }
        }
        return null;
    }

    getPlaylistPositionByTuneSetId(tuneSetId:number) {
        for (var i = 0; i < this.playlistPositions.length; i++) {
            if (tuneSetId == this.playlistPositions[i].tuneSet.tuneSetId) {
                return this.playlistPositions[i];
            }
        }
        return null;
    }

    getPlaylistPositionAsNumbers(): Array<number> {
        let positions: Array<number> = [];

        for (var i = 0; i < this.playlistPositions.length; i++) {
            positions.push(this.playlistPositions[i].position);
        }

        return positions;
    }

    movePlaylistPosition(oldPosition: number, newPosition: number) {
        let movingPlaylistPosition:PlaylistPosition;

        //Change moving Playlist-Position
        for (var z = 0; z < this.playlistPositions.length; z++) {
            if (this.playlistPositions[z].position == oldPosition) {
                this.playlistPositions[z].position = newPosition;
                movingPlaylistPosition = this.playlistPositions[z];
            }
        }

        //Change Playlist-Positions between oldPosition and newPosition
        if (newPosition < oldPosition) {
            // moved down
            for (var y = 0; y < this.playlistPositions.length; y++) {
                if (this.playlistPositions[y].position >= newPosition && this.playlistPositions[y].position < oldPosition) {
                    if (this.playlistPositions[y] != movingPlaylistPosition) {
                        this.playlistPositions[y].position++;
                    }
                }
            }

        } else if (newPosition > oldPosition) {
            // moved up
            for (var y = 0; y < this.playlistPositions.length; y++) {
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

    moveUpPlaylistPosition(position) {
        var oldPosition, newPosition, movingPlaylistPosition;

        oldPosition = parseInt(position);
        newPosition = oldPosition - 1;
        if (newPosition < 1) {
            newPosition = 1
        }

        //Change moving Playlist-Position
        for (var z = 0; z < this.playlistPositions.length; z++) {
            if (this.playlistPositions[z].position == oldPosition) {
                this.playlistPositions[z].position = newPosition.toString();
                movingPlaylistPosition = this.playlistPositions[z];
            }
        }

        //Change overlapping Playlist-Position
        for (var y = 0; y < this.playlistPositions.length; y++) {
            if (this.playlistPositions[y].position == newPosition) {
                if (this.playlistPositions[y] != movingPlaylistPosition) {
                    this.playlistPositions[y].position = oldPosition.toString();
                }
            }
        }

        // Sort PlaylistPositions by position
        this.playlistPositions.sort(function (a, b) {
            return a.position - b.position
        });
    }

    moveDownPlaylistPosition(position) {
        var oldPosition, newPosition, movingPlaylistPosition;

        oldPosition = parseInt(position);
        newPosition = oldPosition + 1;

        if (this.playlistPositions.length < newPosition) {
            newPosition = oldPosition
        } else {
            //Change moving Playlist-Position
            for (var z = 0; z < this.playlistPositions.length; z++) {
                if (this.playlistPositions[z].position == oldPosition) {
                    this.playlistPositions[z].position = newPosition.toString();
                    movingPlaylistPosition = this.playlistPositions[z];
                }
            }

            //Change overlapping Playlist-Position
            for (var y = 0; y < this.playlistPositions.length; y++) {
                if (this.playlistPositions[y].position == newPosition) {
                    if (this.playlistPositions[y] != movingPlaylistPosition) {
                        this.playlistPositions[y].position = oldPosition.toString();
                    }
                }
            }

            // Sort PlaylistPositions by position
            this.playlistPositions.sort(function (a, b) {
                return a.position - b.position
            });

        }
    }

    deleteTune(intTuneId: number) {
        let playlistPosition:PlaylistPosition;
        
        for (var y = 0; y < this.playlistPositions.length; y++) {
            playlistPosition = this.playlistPositions[y];
            
            playlistPosition.deleteTune(intTuneId); 
            
            if (playlistPosition.setTuneSetPositionPlayInfos.length == 0) {
                // Empty PlaylistPosition
                this.deletePlaylistPosition(playlistPosition.position);
            }                    
        }
    }

    deletePlaylistPosition(removedPosition:number) {
        let removedPlaylistPosition:PlaylistPosition;
        
        for (var z = 0; z < this.playlistPositions.length; z++) {
            if (this.playlistPositions[z].position == removedPosition) {
                removedPlaylistPosition = this.playlistPositions[z];
                // Delete playlistPosition from playlist
                this.playlistPositions.splice(z, 1);
                //Falls eine tuneSetPositionPlayInfo zur gelöschten playlistPosition vorhanden wäre_
                //Löschen nicht nötig, da bei writeAbcHeader die playlistPosition nicht mehr geschrieben wird,
                //und somit die tuneSetPositionPlayInfo auch nicht.
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

        for (var y = 0; y < this.playlistPositions.length; y++) {
            currentPosition = this.playlistPositions[y].position;

            if (currentPosition > removedPlaylistPosition.position) {
                currentPosition--;
                // Change Position on PlaylistPosition
                this.playlistPositions[y].position = currentPosition;
            }
        }
    }
}
