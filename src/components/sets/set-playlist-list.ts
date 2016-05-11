import {Component, Input, OnInit, OnDestroy} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {TuneSet} from '../../business/model/tuneset';
import {Playlist} from '../../business/model/playlist';
import {SetPlaylistListItemUI} from '../../components/sets/set-playlist-list-item';


@Component({
    selector: 'etb-set-playlist-list',
    templateUrl: './components/sets/set-playlist-list.html',
    directives: [ROUTER_DIRECTIVES, SetPlaylistListItemUI],
    styleUrls: ['./components/sets/set-playlist-list.css']
})
export class SetPlaylistListUI implements OnInit, OnDestroy {
    @Input() set: TuneSet;
    playlists: Array<Playlist>;
    modelActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.playlists = this.tuneBookService.getPlaylistsByTuneSetId(this.set.id);
        
        this.modelActionSubscription = this.tuneBookService.modelActionObservable.subscribe(
            (action) => {
                console.log("set-playlist-list:modelActionSubscription called: " + action);
                if (action === ACTION.ADD_SETS_TO_PLAYLIST) {
                    this.playlists = this.tuneBookService.getPlaylistsByTuneSetId(this.set.id);
                } 
            });
    }
    
    ngOnDestroy() {
        this.modelActionSubscription.unsubscribe();
    }
}


