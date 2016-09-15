import { Component, Input, OnInit } from '@angular/core';

import { TuneBookService, TuneSet, Playlist, FilterSettings, SortSettings } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-set-list-menu',
    templateUrl: 'set-list-menu.component.html',
    styleUrls: ['set-list-menu.component.css'],
})
export class SetListMenuComponent implements OnInit {
    @Input() sets: Array<TuneSet>;
    filterSettings: FilterSettings;
    sortSettings: SortSettings;
    playlists: Array<Playlist>;
    selectedPlaylist: Playlist;
    applySetIds: boolean;

    constructor(public tuneBookService: TuneBookService) {
        //console.log('set-list-menu:constructor called');
    }

    ngOnInit() {
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
        this.applySetIds = this.filterSettings.applySetIds;

        this.playlists = this.tuneBookService.getPlaylists();

        this.sortSettings = this.tuneBookService.getCurrentSortSettings();
        //console.log('set-list-menu:ngOnInit called');

    }

    sortPlaydate() {
        if (!(this.sortSettings.tuneSetListSort === 'playDate') || this.sortSettings.tuneSetListAscending) {
            //sort tuneSet playdate descending  
            this.sets.sort(function (a: TuneSet, b: TuneSet) {
                return (a.getLastPlayDate() > b.getLastPlayDate()) ? -1 : (a.getLastPlayDate() < b.getLastPlayDate()) ? 1 : 0;
            });
            this.sortSettings.tuneSetListSort = 'playDate';
            this.sortSettings.tuneSetListAscending = false;
        } else {
            //sort tuneSet playdate ascending  
            this.sets.sort(function (a: TuneSet, b: TuneSet) {
                return (a.getLastPlayDate() > b.getLastPlayDate()) ? 1 : (a.getLastPlayDate() < b.getLastPlayDate()) ? -1 : 0;
            });
            this.sortSettings.tuneSetListSort = 'playDate';
            this.sortSettings.tuneSetListAscending = true;
        }

        window.scrollTo(0, 0);
    }

    sortRandom() {
        this.sets = this.tuneBookService.shuffleTuneSetList();
        this.sortSettings.tuneSetListSort = 'random';

        window.scrollTo(0, 0);
    }

    sortId() {
        if (!(this.sortSettings.tuneSetListSort === 'id') || !this.sortSettings.tuneSetListAscending) {
            //sort tuneSet id ascending  
            this.sets.sort(function (a: TuneSet, b: TuneSet) {
                return a.id - b.id;
            });
            this.sortSettings.tuneSetListSort = 'id';
            this.sortSettings.tuneSetListAscending = true;

        } else if (!(this.sortSettings.tuneSetListSort === 'id') || this.sortSettings.tuneSetListAscending) {
            //sort tuneSet id descending  
            this.sets.sort(function (a: TuneSet, b: TuneSet) {
                return b.id - a.id;
            });
            this.sortSettings.tuneSetListSort = 'id';
            this.sortSettings.tuneSetListAscending = false;
        }

        window.scrollTo(0, 0);
    }

    filterSets() {
        this.filterSettings.toggleSetIdFilter();
        this.tuneBookService.applyFilter();
        this.applySetIds = !this.applySetIds;
    }

    setSelectedPlaylistId(playlist: Playlist) {
        this.selectedPlaylist = playlist;
    }

    addSelectedSetsToSelectedPlaylist() {
        if (this.selectedPlaylist === undefined) {
            //TODO: More elegant
            alert('No Playlist selected!');
            //TODO: Stay on Modal
        } else {
            this.tuneBookService.addPlaylistPositions(this.selectedPlaylist.id, this.filterSettings.setIds);
        }
    }
}
