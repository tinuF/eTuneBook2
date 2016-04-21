import {Component, Input, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {Playlist} from '../../business/model/playlist';
import {FilterSettings} from '../../common/settings/filter-settings';
import {EditButtonUI} from '../../components/common/edit-btn';

@Component({
    selector: 'etb-set-list-menu',
    templateUrl: './components/sets/set-list-menu.html',
    directives: [ROUTER_DIRECTIVES, EditButtonUI],
    styleUrls: ['./components/sets/set-list-menu.css'],
})
export class SetListMenuUI implements OnInit {
    @Input() sets: Array<TuneSet>;
    sorting: string;
    filterSettings: FilterSettings;
    playlists: Array<Playlist>;
    selectedPlaylist: Playlist;

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
                return (a.getLastPlayDate() > b.getLastPlayDate()) ? 1 : (a.getLastPlayDate() < b.getLastPlayDate()) ? -1 : 0;
            })
            this.sorting = "playdateAsc";

        } else if (this.sorting !== "playdateDesc") {
            //sort tuneSet playdate descending  
            this.sets.sort(function(a: TuneSet, b: TuneSet) {
                return (a.getLastPlayDate() > b.getLastPlayDate()) ? -1 : (a.getLastPlayDate() < b.getLastPlayDate()) ? 1 : 0;
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

    setSelectedPlaylistId(playlist:Playlist) {
        this.selectedPlaylist = playlist;
    }

    addSelectedSetsToSelectedPlaylist() {
        this.tuneBookService.addPlaylistPositions(this.selectedPlaylist.id, this.filterSettings.setIds);
        this.tuneBookService.storeTuneBookAbc();
    }
}


