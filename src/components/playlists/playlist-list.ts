import {Component, DoCheck, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Playlist} from '../../business/model/playlist';
import {PlaylistListItemUI} from '../../components/playlists/playlist-list-item';
import {PlaylistListMenuUI} from '../../components/playlists/playlist-list-menu';


@Component({
    selector: 'etb-playlist-list',
    templateUrl: './components/playlists/playlist-list.html',
    directives: [ROUTER_DIRECTIVES, PlaylistListItemUI, PlaylistListMenuUI],
    styleUrls: ['./components/playlists/playlist-list.css']
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


