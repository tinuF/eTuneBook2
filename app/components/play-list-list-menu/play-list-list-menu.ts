import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Playlist} from '../../business/model/playlist';
import {FilterSettings} from '../../common/settings/filter-settings';



@Component({
    selector: 'etb-play-list-list-menu',
    inputs: ['playlists'],
    templateUrl: './components/play-list-list-menu/play-list-list-menu.html',
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ['./components/play-list-list-menu/play-list-list-menu.css'],
})
export class PlaylistListMenuUI implements OnInit {
    sorting: string;
    filterSettings: FilterSettings;
    playlists: Array<Playlist>;
    selectedPlaylistId: number;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
    }

    filterPlaylists(e) {
        this.filterSettings.togglePlaylistIdFilter();
        this.tuneBookService.applyFilter();
    }
}


