import {Component, OnInit, OnDestroy} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, RouteParams, Location} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
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
export class PlaylistPositionUI implements OnInit, OnDestroy {
    playlist: Playlist;
    playlistPosition: PlaylistPosition;
    editModus: boolean;
    actionSubscription: Subscription;
    showDots: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router, routeParams: RouteParams, public location: Location) {
        this.playlistPosition = this.tuneBookService.getPlaylistPosition(parseInt(routeParams.get('id')), parseInt(routeParams.get('pos')));
        this.playlist = this.tuneBookService.getPlaylist(this.playlistPosition.playlistId);
        this.showDots = false;
    }
    
    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.actionSubscription = this.tuneBookService.actionObservable.subscribe(
            (action) => {
                console.log("playlist-position:actionSubscription called: " + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }
    
    ngOnDestroy() {
        this.actionSubscription.unsubscribe();
    }
    
    toggleDots() {
        this.showDots = !this.showDots;
    }
}

