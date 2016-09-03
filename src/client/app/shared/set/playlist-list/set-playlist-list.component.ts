import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, TuneSet, Playlist, ACTION } from '../../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-set-playlist-list',
    templateUrl: 'set-playlist-list.component.html',
    styleUrls: ['set-playlist-list.component.css']
})
export class SetPlaylistListComponent implements OnInit, OnDestroy {
    @Input() set: TuneSet;
    playlists: Array<Playlist>;
    modelActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.playlists = this.tuneBookService.getPlaylistsByTuneSetId(this.set.id);

        this.modelActionSubscription = this.tuneBookService.modelActionObservable.subscribe(
            (action) => {
                //console.log('set-playlist-list:modelActionSubscription called: ' + action);
                if (action === ACTION.ADD_SETS_TO_PLAYLIST) {
                    this.playlists = this.tuneBookService.getPlaylistsByTuneSetId(this.set.id);
                }
            });
    }

    ngOnDestroy() {
        this.modelActionSubscription.unsubscribe();
    }
}


