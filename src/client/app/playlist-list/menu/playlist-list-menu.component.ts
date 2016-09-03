import { Component, Input, OnInit } from '@angular/core';

import { TuneBookService, Playlist, FilterSettings } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-playlist-list-menu',
    templateUrl: 'playlist-list-menu.component.html',
    styleUrls: ['playlist-list-menu.component.css']
})
export class PlaylistListMenuComponent implements OnInit {
    filterSettings: FilterSettings;
    @Input() playlists: Array<Playlist>;

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


