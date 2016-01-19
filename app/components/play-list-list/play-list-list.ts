import {Component, DoCheck, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Playlist} from '../../business/model/playlist';
import {PlaylistListItemUI} from '../../components/play-list-list-item/play-list-list-item';
import {PlaylistListMenuUI} from '../../components/play-list-list-menu/play-list-list-menu';


@Component({
    selector: 'etb-playlist-list',
    templateUrl: './components/play-list-list/play-list-list.html',
    directives: [ROUTER_DIRECTIVES, PlaylistListItemUI, PlaylistListMenuUI],
    styleUrls: ['./components/play-list-list/play-list-list.css']
})
export class PlaylistListUI implements OnInit, DoCheck {
    playlists: Array<Playlist>;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.playlists = this.tuneBookService.getPlaylistsFiltered();
    }

    ngDoCheck() {
        this.playlists = this.tuneBookService.getPlaylistsFiltered();
    }
}


