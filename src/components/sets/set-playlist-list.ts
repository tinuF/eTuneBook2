import {Component, Input, OnInit, DoCheck} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {Playlist} from '../../business/model/playlist';
import {SetPlaylistListItemUI} from '../../components/sets/set-playlist-list-item';


@Component({
    selector: 'etb-set-playlist-list',
    templateUrl: './components/sets/set-playlist-list.html',
    directives: [ROUTER_DIRECTIVES, SetPlaylistListItemUI],
    styleUrls: ['./components/sets/set-playlist-list.css']
})
export class SetPlaylistListUI implements OnInit, DoCheck {
    @Input() set: TuneSet;
    playlists: Array<Playlist>;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.playlists = this.tuneBookService.getPlaylistsByTuneSetId(this.set.id);
    }

    ngDoCheck() {
        this.playlists = this.tuneBookService.getPlaylistsByTuneSetId(this.set.id);
    }
}


