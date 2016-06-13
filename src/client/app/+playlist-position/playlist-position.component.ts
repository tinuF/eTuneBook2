import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, Playlist, PlaylistPosition, ACTION } from '../business/index';
import { PlayListPositionCopierComponent } from '../shared/playlist/playlist-position-copier.component';
import { PlayListPositionSetComponent } from './set/playlist-position-set.component';
import { PlayListPositionMenuComponent, } from './menu/playlist-position-menu.component';

@Component({
    moduleId: module.id,
    selector: 'etb-playlist-position',
    templateUrl: 'playlist-position.component.html',
    styleUrls: ['playlist-position.component.css'],
    directives: [ROUTER_DIRECTIVES, PlayListPositionSetComponent,
        PlayListPositionMenuComponent, PlayListPositionCopierComponent]
})
export class PlaylistPositionComponent implements OnInit, OnDestroy {
    playlist: Playlist;
    playlistPosition: PlaylistPosition;
    playlistPositionToBeCopied: PlaylistPosition;
    editModus: boolean;
    modusActionSubscription: Subscription;
    routerSubscription: Subscription;
    showDots: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router, public route: ActivatedRoute) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                //console.log('playlist-position:modusActionSubscription called: ' + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });

        this.routerSubscription = this.route
            .params
            .subscribe(params => {
                let playlistId = +params['pl'];
                let position = +params['ps'];
                this.playlistPosition = this.tuneBookService.getPlaylistPosition(playlistId, position);
                this.playlist = this.tuneBookService.getPlaylist(this.playlistPosition.playlistId);
                this.showDots = false;
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
        this.routerSubscription.unsubscribe();
    }

    toggleDots() {
        this.showDots = !this.showDots;
    }

    setPlaylistPositionToBeCopied(playlistPosition: PlaylistPosition) {
        this.playlistPositionToBeCopied = playlistPosition;
    }
}

