import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, OnActivate, RouteSegment } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, Playlist, PlaylistPosition, ACTION } from '../business/index';
import { PlayListPositionCopierComponent } from '../shared/index';
import { PlayListPositionSetComponent, PlayListPositionMenuComponent, } from '../+playlist-position/index';

@Component({
    moduleId: module.id,
    selector: 'etb-playlist-position',
    templateUrl: 'playlist-position.component.html',
    styleUrls: ['playlist-position.component.css'],
    directives: [ROUTER_DIRECTIVES, PlayListPositionSetComponent,
        PlayListPositionMenuComponent, PlayListPositionCopierComponent]
})
export class PlaylistPositionComponent implements OnInit, OnActivate, OnDestroy {
    playlist: Playlist;
    playlistPosition: PlaylistPosition;
    playlistPositionToBeCopied: PlaylistPosition;
    editModus: boolean;
    modusActionSubscription: Subscription;
    showDots: boolean;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                console.log('playlist-position:modusActionSubscription called: ' + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }

    routerOnActivate(currRouteSegment: RouteSegment) {
        this.playlistPosition = this.tuneBookService.getPlaylistPosition(
            parseInt(currRouteSegment.getParam('id')), parseInt(currRouteSegment.getParam('pos')));
        this.playlist = this.tuneBookService.getPlaylist(this.playlistPosition.playlistId);
        this.showDots = false;
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }

    toggleDots() {
        this.showDots = !this.showDots;
    }

    setPlaylistPositionToBeCopied(playlistPosition: PlaylistPosition) {
        this.playlistPositionToBeCopied = playlistPosition;
    }
}

