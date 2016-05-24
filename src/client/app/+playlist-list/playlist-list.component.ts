import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, Playlist, ACTION } from '../business/index';
import { PlaylistListItemComponent } from './item/playlist-list-item.component';
import { PlaylistListMenuComponent } from './menu/playlist-list-menu.component';

@Component({
    moduleId: module.id,
    selector: 'etb-playlist-list',
    templateUrl: 'playlist-list.component.html',
    directives: [PlaylistListItemComponent, PlaylistListMenuComponent],
    styleUrls: ['playlist-list.component.css']
})
export class PlaylistListComponent implements OnInit, OnDestroy {
    playlists: Array<Playlist>;
    filterActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.playlists = this.tuneBookService.getPlaylistsFiltered();

        this.filterActionSubscription = this.tuneBookService.filterActionObservable.subscribe(
            (action) => {
                //console.log('playlist-list:filterActionSubscription called: ' + action);
                if (action === ACTION.APPLY_FILTER) {
                    this.playlists = this.tuneBookService.getPlaylistsFiltered();
                }
            });
    }

    ngOnDestroy() {
        this.filterActionSubscription.unsubscribe();
        //console.log('tune-list:ngOnDestroy called');
    }
}


