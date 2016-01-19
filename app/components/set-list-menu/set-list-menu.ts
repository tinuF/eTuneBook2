import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {Playlist} from '../../business/model/playlist';
import {FilterSettings} from '../../common/settings/filter-settings';



@Component({
    selector: 'etb-set-list-menu',
    inputs: ['sets'],
    templateUrl: './components/set-list-menu/set-list-menu.html',
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ['./components/set-list-menu/set-list-menu.css'],
})
export class SetListMenuUI implements OnInit {
    sets: Array<TuneSet>;
    sorting: string;
    filterSettings: FilterSettings;
    playlists: Array<Playlist>;
    selectedPlaylistId: number;

    constructor(public tuneBookService: TuneBookService) {
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
        this.playlists = this.tuneBookService.getPlaylists();
    }

    ngOnInit() {

    }

    sortPlaydate(e) {

        if (this.sorting !== "playdateAsc") {
            //sort tuneSet playdate ascending  
            this.sets.sort(function(a: TuneSet, b: TuneSet) {
                return a.getLastPlayDate() - b.getLastPlayDate()
            })
            this.sorting = "playdateAsc";

        } else if (this.sorting !== "playdateDesc") {
            //sort tuneSet playdate descending  
            this.sets.sort(function(a: TuneSet, b: TuneSet) {
                return b.getLastPlayDate() - a.getLastPlayDate()
            })
            this.sorting = "playdateDesc";
        }

    }

    sortRandom(e) {
        this.sets = this.tuneBookService.shuffleTuneSetList();
        this.sorting = "random";
    }

    filterSets(e) {
        this.filterSettings.toggleSetIdFilter();
        this.tuneBookService.applyFilter();
    }

    setSelectedPlaylistId(e) {
        this.selectedPlaylistId = e.target.value;
    }

    addSelectedSetsToSelectedPlaylist() {
        this.tuneBookService.addPlaylistPositions(this.selectedPlaylistId, this.filterSettings.setIds);
        this.tuneBookService.storeTuneBookAbc();
    }
}


