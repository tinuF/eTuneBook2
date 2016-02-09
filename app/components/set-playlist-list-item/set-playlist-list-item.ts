import {Component, Input, OnInit} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Playlist} from '../../business/model/playlist';
import {EliminateThe} from '../../pipes/eliminate-the';


@Component({
    selector: 'etb-set-playlist-list-item',
    templateUrl: './components/set-playlist-list-item/set-playlist-list-item.html',
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ['./components/set-playlist-list-item/set-playlist-list-item.css'],
    pipes: [EliminateThe]
})
export class SetPlaylistListItemUI implements OnInit {
    @Input() playlist: Playlist;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
       
    }
}


