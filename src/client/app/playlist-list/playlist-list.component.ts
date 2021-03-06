import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, Playlist, ACTION } from '../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-playlist-list',
    templateUrl: 'playlist-list.component.html',
    styleUrls: ['playlist-list.component.css']
})
export class PlaylistListComponent implements OnInit, AfterViewInit, OnDestroy {
    playlists: Array<Playlist>;
    filterActionSubscription: Subscription;
    modelActionSubscription: Subscription;
    isRendering: boolean;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        // we need to detach the change detector initially, to prevent a
        // 'changed after checked' error.

        //this.cdr.detach();
        this.isRendering = true;
        // this.tuneBookService.isRendering() wird gebraucht, damit auf dieser Stufe cdr.detach() nicht nötig
        // warum ist unklar
        this.tuneBookService.isRendering();
        this.playlists = this.tuneBookService.getPlaylistsFiltered();

        this.filterActionSubscription = this.tuneBookService.filterActionObservable.subscribe(
            (action) => {
                //console.log('playlist-list:filterActionSubscription called: ' + action);
                if (action === ACTION.APPLY_FILTER) {
                    this.playlists = this.tuneBookService.getPlaylistsFiltered();
                }
            });

        this.modelActionSubscription = this.tuneBookService.modelActionObservable.subscribe(
            (action) => {
                //console.log('tune-list:modelActionSubscription called: ' + action);

                if (action === ACTION.IMPORT_TUNEBOOK ||
                    action === ACTION.LOAD_EXAMPLE_TUNEBOOK ||
                    action === ACTION.INITIALIZE_TUNEBOOK ||
                    action === ACTION.DELETE_PLAYLIST) {

                    this.playlists = this.tuneBookService.getPlaylistsFiltered();
                }
            });
    }

    ngAfterViewInit() {
        this.isRendering = false;
        //setTimeout(() => this.cdr.reattach());
        this.tuneBookService.isRendered();
        //console.log('playlist-list:ngAfterViewInit called');
    }

    ngOnDestroy() {
        this.filterActionSubscription.unsubscribe();
        //console.log('tune-list:ngOnDestroy called');
    }
}


