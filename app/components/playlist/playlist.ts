import {Component, OnInit, DoCheck} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Playlist} from '../../business/model/playlist';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {PlayListItemUI} from '../../components/playlist-item/playlist-item';
import {PlayListMenuUI} from '../../components/playlist-menu/playlist-menu';


@Component({
    selector: 'etb-playlist',
    templateUrl: './components/playlist/playlist.html',
    directives: [ROUTER_DIRECTIVES, PlayListItemUI, PlayListMenuUI],
    styleUrls: ['./components/playlist/playlist.css']
})
export class PlaylistUI implements OnInit, DoCheck {
    playlist: Playlist;
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService, routeParams: RouteParams) {
        this.playlist = this.tuneBookService.getPlaylist(routeParams.get('id'));
    }

    ngOnInit() {
        this.sortPlaylistPosition();
        this.editModus = this.tuneBookService.isEditModus();
    }

    ngDoCheck() {
        this.sortPlaylistPosition();
        this.editModus = this.tuneBookService.isEditModus();
    }

    sortPlaylistPosition() {
        this.playlist.playlistPositions.sort(function(a: PlaylistPosition, b: PlaylistPosition) {
            return a.position - b.position;
        });
    }

    handleKeyDownOnPlaylistName(e) {
        var keycode = (e.keyCode ? e.keyCode : e.which);

        if (keycode === 13) { // ENTER
            e.target.blur();
            e.preventDefault();
            this.handleBlurOnPlaylistName(e);
        }
    }

    handleBlurOnPlaylistName(e) {
        this.playlist.name = e.target.value;
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnPlaylistBand(e) {
        var keycode = (e.keyCode ? e.keyCode : e.which);

        if (keycode === 13) { // ENTER
            e.target.blur();
            e.preventDefault();
            this.handleBlurOnPlaylistBand(e);
        }
    }

    handleBlurOnPlaylistBand(e) {
        this.playlist.band = e.target.value;
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnPlaylistEvent(e) {
        var keycode = (e.keyCode ? e.keyCode : e.which);

        if (keycode === 13) { // ENTER
            e.target.blur();
            e.preventDefault();
            this.handleBlurOnPlaylistEvent(e);
        }
    }

    handleBlurOnPlaylistEvent(e) {
        this.playlist.event = e.target.value;
        this.tuneBookService.storeTuneBookAbc();
    }
}


