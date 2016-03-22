import {Component, Input, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {Playlist} from '../../business/model/playlist';
import {FilterSettings} from '../../common/settings/filter-settings';
import {EditButtonUI} from '../../components/edit-btn/edit-btn';

@Component({
    selector: 'etb-set-list-menu',
    templateUrl: './components/set-list-menu/set-list-menu.html',
    directives: [ROUTER_DIRECTIVES, EditButtonUI],
    styleUrls: ['./components/set-list-menu/set-list-menu.css'],
})
export class SetListMenuUI implements OnInit {
    @Input() sets: Array<TuneSet>;
    sorting: string;
    filterSettings: FilterSettings;
    playlists: Array<Playlist>;
    selectedPlaylistId: number;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
        this.playlists = this.tuneBookService.getPlaylists();
    }

    sortPlaydate(e) {

        if (this.sorting !== "playdateAsc") {
            //sort tuneSet playdate ascending  
            this.sets.sort(function(a: TuneSet, b: TuneSet) {
                return a.getLastPlayDate().getTime() - b.getLastPlayDate().getTime()
            })
            this.sorting = "playdateAsc";

        } else if (this.sorting !== "playdateDesc") {
            //sort tuneSet playdate descending  
            this.sets.sort(function(a: TuneSet, b: TuneSet) {
                return b.getLastPlayDate().getTime() - a.getLastPlayDate().getTime()
            })
            this.sorting = "playdateDesc";
        }

    }

    sortRandom(e) {
        this.sets = this.tuneBookService.shuffleTuneSetList();
        this.sorting = "random";
    }

    sortId(e) {

        if (this.sorting !== "idAsc") {
            //sort tuneSet id ascending  
            this.sets.sort(function(a: TuneSet, b: TuneSet) {
                return a.tuneSetId - b.tuneSetId;
            })
            this.sorting = "idAsc";

        } else if (this.sorting !== "idDesc") {
            //sort tuneSet id descending  
            this.sets.sort(function(a: TuneSet, b: TuneSet) {
                return b.tuneSetId - a.tuneSetId;
            })
            this.sorting = "idDesc";
        }

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


