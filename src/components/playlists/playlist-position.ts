import {Component, OnInit, DoCheck} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, RouteParams, Location} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';
import {Playlist} from '../../business/model/playlist';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {FromNow} from '../../pipes/from-now';
import {PlayListPositionSetUI} from '../../components/playlists/playlist-position-set';
import {PlayListPositionMenuUI} from '../../components/playlists/playlist-position-menu';

@Component({
    selector: 'etb-playlist-position',
    templateUrl: './components/playlists/playlist-position.html',
    styleUrls: ['./components/playlists/playlist-position.css'],
    directives: [ROUTER_DIRECTIVES, PlayListPositionSetUI, PlayListPositionMenuUI],
    pipes: [FromNow]
})
export class PlaylistPositionUI implements OnInit, DoCheck {
    playlist: Playlist;
    playlistPosition: PlaylistPosition;
    editModus: boolean;
    showDots: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router, routeParams: RouteParams, public location: Location) {
        this.playlistPosition = this.tuneBookService.getPlaylistPosition(routeParams.get('id'), routeParams.get('pos'));
        this.playlist = this.tuneBookService.getPlaylist(this.playlistPosition.playlistId);
        this.showDots = false;
    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    ngDoCheck() {
        this.editModus = this.tuneBookService.isEditModus();
    }
    
    toggleDots() {
        this.showDots = !this.showDots;
    }
}
