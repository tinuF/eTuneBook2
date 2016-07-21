import { Component, Input, OnInit } from '@angular/core';

import { TuneBookService, TuneSet, Playlist, FilterSettings } from '../../business/index';
import { EditButtonComponent } from '../../shared/modus/edit-btn.component';

@Component({
    moduleId: module.id,
    selector: 'etb-set-list-menu',
    templateUrl: 'set-list-menu.component.html',
    directives: [EditButtonComponent],
    styleUrls: ['set-list-menu.component.css'],
})
export class SetListMenuComponent implements OnInit {
    @Input() sets: Array<TuneSet>;
    sorting: string;
    filterSettings: FilterSettings;
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
        //Sets sind bereits mit SetId aufsteigend sortiert
        this.sorting = 'idAsc';
        //console.log('set-list-menu:ngOnInit called');

    }

    sortPlaydate() {

        if (this.sorting !== 'playdateAsc') {
            //sort tuneSet playdate ascending  
            this.sets.sort(function (a: TuneSet, b: TuneSet) {
                return (a.getLastPlayDate() > b.getLastPlayDate()) ? 1 : (a.getLastPlayDate() < b.getLastPlayDate()) ? -1 : 0;
            });
            this.sorting = 'playdateAsc';

        } else if (this.sorting !== 'playdateDesc') {
            //sort tuneSet playdate descending  
            this.sets.sort(function (a: TuneSet, b: TuneSet) {
                return (a.getLastPlayDate() > b.getLastPlayDate()) ? -1 : (a.getLastPlayDate() < b.getLastPlayDate()) ? 1 : 0;
            });
            this.sorting = 'playdateDesc';
        }

    }

    sortRandom() {
        this.sets = this.tuneBookService.shuffleTuneSetList();
        this.sorting = 'random';
    }

    sortId() {

        if (this.sorting !== 'idAsc') {
            //sort tuneSet id ascending  
            this.sets.sort(function (a: TuneSet, b: TuneSet) {
                return a.id - b.id;
            });
            this.sorting = 'idAsc';

        } else if (this.sorting !== 'idDesc') {
            //sort tuneSet id descending  
            this.sets.sort(function (a: TuneSet, b: TuneSet) {
                return b.id - a.id;
            });
            this.sorting = 'idDesc';
        }

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
