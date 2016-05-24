import { Component, Input, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { TuneBookService, Playlist, FilterSettings } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-playlist-list-item',
    templateUrl: 'playlist-list-item.component.html',
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ['playlist-list-item.component.css']
})
export class PlaylistListItemComponent implements OnInit {
    @Input() playlist: Playlist;
    filterSettings: FilterSettings;
    shown: boolean;
    checked: boolean;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
        this.shown = true;
        this.checked = false;
    }
//TODO: remove (läuft hier sowie so nicht durch)
    onCheck() {
        if (this.filterSettings.applyPlaylistIds && this.checked) {
            this.shown = true;
        } else {
            this.shown = false;
        }
    }

    togglePlaylistSelection(e) {
        if (e.target.checked) {
            this.filterSettings.addPlaylistId(this.playlist.id);

        } else {
            this.filterSettings.removePlaylistId(this.playlist.id);
        }
    }

    isSelected() {
        return this.filterSettings.playlistIds.indexOf(this.playlist.id) > -1;
    }
}


