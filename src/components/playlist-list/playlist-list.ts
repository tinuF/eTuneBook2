import {Component, OnInit, OnDestroy} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {Playlist} from '../../business/model/playlist';
import {PlaylistListItemUI} from '../../components/playlist-list/playlist-list-item';
import {PlaylistListMenuUI} from '../../components/playlist-list/playlist-list-menu';


@Component({
    selector: 'etb-playlist-list',
    templateUrl: './components/playlist-list/playlist-list.html',
    directives: [ROUTER_DIRECTIVES, PlaylistListItemUI, PlaylistListMenuUI],
    styleUrls: ['./components/playlist-list/playlist-list.css']
})
export class PlaylistListUI implements OnInit, OnDestroy {
    playlists: Array<Playlist>;
    filterActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.playlists = this.tuneBookService.getPlaylistsFiltered();
        
        this.filterActionSubscription = this.tuneBookService.filterActionObservable.subscribe(
            (action) => {
                console.log("playlist-list:filterActionSubscription called: " + action);
                if (action === ACTION.APPLY_FILTER) {
                    this.playlists = this.tuneBookService.getPlaylistsFiltered();
                }
            });
    }

    ngOnDestroy() {
        this.filterActionSubscription.unsubscribe();
        console.log("tune-list:ngOnDestroy called");
    }
}


