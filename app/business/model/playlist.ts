import {PlaylistPosition} from './playlistposition';

export class Playlist {
  id: string;
  name: string;
  event: string;
  band: string;
  playlistPositions: Array<PlaylistPosition>;

  constructor(playlistId, playlistName, playlistEvent, playlistBand) {
    this.id = playlistId;
    this.name = playlistName;
    this.event = playlistEvent;
    this.band = playlistBand;
    this.playlistPositions = [];
  }

  addPlaylistPosition(playlistPosition) {
    this.playlistPositions.push(playlistPosition);
  }

  getPlaylistPosition(position) {
    for (var i = 0; i < this.playlistPositions.length; i++) {
      if (position == this.playlistPositions[i].position) {
        return this.playlistPositions[i];
      }
    }
    return null;
  }

  movePlaylistPosition(oldPosition: number, newPosition: number) {
    var movingPlaylistPosition;

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
    this.playlistPositions.sort(function(a, b) {
      return a.position - b.position
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
    this.playlistPositions.sort(function(a, b) {
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
      this.playlistPositions.sort(function(a, b) {
        return a.position - b.position
      });

    }
  }

  deletePlaylistPosition(position) {
    var playlistPosition = null;
    var removedPosition = 0;
    removedPosition = parseInt(position);

    for (var z = 0; z < this.playlistPositions.length; z++) {
      if (this.playlistPositions[z].position == position) {
        playlistPosition = this.playlistPositions[z];
        // Delete playlistPosition from playlist
        this.playlistPositions.splice(z, 1);
        //Falls eine tuneSetPositionPlayInfo zur gelöschten playlistPosition vorhanden wäre_
        //Löschen nicht nötig, da bei writeAbcHeader die playlistPosition nicht mehr geschrieben wird,
        //und somit die tuneSetPositionPlayInfo auch nicht.
      }
    }

    if (this.playlistPositions.length == 0) {
      // Empty playlistt

    } else {
      // playlist still has playlistPositions
      // Adjust Positions of remaining playlistPositions: Only necessary for playlistPositions that come after the removed playlistPosition
      var currentPosition = 0;

      for (var y = 0; y < this.playlistPositions.length; y++) {
        currentPosition = this.playlistPositions[y].position;

        if (currentPosition > removedPosition) {
          currentPosition--;
          // Change Position on TuneSetPosition
          this.playlistPositions[y].position = currentPosition;
        }
      }
    }
  }
}
