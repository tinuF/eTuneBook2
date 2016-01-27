import {Component, OnInit, DoCheck} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Playlist} from '../../business/model/playlist';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {PlayListItemUI} from '../../components/play-list-item/play-list-item';
import {PlayListMenuUI} from '../../components/play-list-menu/play-list-menu';


@Component({
    selector: 'etb-play-list',
    templateUrl: './components/play-list/play-list.html',
    directives: [ROUTER_DIRECTIVES, PlayListItemUI, PlayListMenuUI],
    styleUrls: ['./components/play-list/play-list.css']
})
export class PlaylistUI implements OnInit, DoCheck {
    playlist: Playlist;

    constructor(public tuneBookService: TuneBookService, routeParams: RouteParams) {
        this.playlist = this.tuneBookService.getPlaylist(routeParams.get('id'));
    }

    ngOnInit() {
        this.sortPlaylistPosition();
    }

    ngDoCheck() {
        this.sortPlaylistPosition();
    }

    sortPlaylistPosition() {
        this.playlist.playlistPositions.sort(function(a: PlaylistPosition, b: PlaylistPosition) {
            return a.position - b.position;
        });
    }

    handleKeyDownOnPlaylistName(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnPlaylistName(event);
        }
    }

    handleBlurOnPlaylistName(event) {
        this.playlist.name = event.target.textContent;
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnPlaylistBand(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnPlaylistBand(event);
        }
    }

    handleBlurOnPlaylistBand(event) {
        this.playlist.band = event.target.textContent;
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnPlaylistEvent(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnPlaylistEvent(event);
        }
    }

    handleBlurOnPlaylistEvent(event) {
        this.playlist.event = event.target.textContent;
        this.tuneBookService.storeTuneBookAbc();
    }
}


