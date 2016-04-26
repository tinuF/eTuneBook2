import {Component, Input, OnInit} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {Playlist} from '../../business/model/playlist';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {EliminateThe} from '../../pipes/eliminate-the';


@Component({
    selector: 'etb-set-playlist-list-item',
    templateUrl: './components/sets/set-playlist-list-item.html',
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ['./components/sets/set-playlist-list-item.css'],
    pipes: [EliminateThe]
})
export class SetPlaylistListItemUI implements OnInit {
    @Input() playlist: Playlist;
    @Input() set: TuneSet;
    playlistPosition: PlaylistPosition;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
       this.playlistPosition = this.tuneBookService.getPlaylistPositionByTuneSetId(this.playlist.id, this.set.id);
    }
}


