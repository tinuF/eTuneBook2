import {Component, Input, OnInit} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Playlist} from '../../business/model/playlist';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FilterSettings} from '../../common/settings/filter-settings';


@Component({
    selector: 'etb-playlist-list-item',
    templateUrl: './components/playlist-list-item/playlist-list-item.html',
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ['./components/playlist-list-item/playlist-list-item.css'],
    pipes: [EliminateThe]
})
export class PlaylistListItemUI implements OnInit {
    @Input() playlist: Playlist;
    filterSettings: FilterSettings;
    shown: boolean;
    checked: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
        this.shown = true;
        this.checked = false;
    }

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


