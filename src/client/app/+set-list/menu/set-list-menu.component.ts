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

    constructor(public tuneBookService: TuneBookService) {
        console.log('set-list-menu:constructor called');
    }

    ngOnInit() {
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
        this.playlists = this.tuneBookService.getPlaylists();
    }

    sortPlaydate(e) {

        if (this.sorting !== 'playdateAsc') {
            //sort tuneSet playdate ascending  
            this.sets.sort(function (a: TuneSet, b: TuneSet) {
                return (a.getLastPlayDate() > b.getLastPlayDate()) ? 1 : (a.getLastPlayDate() < b.getLastPlayDate()) ? -1 : 0;
            })
            this.sorting = 'playdateAsc';

        } else if (this.sorting !== 'playdateDesc') {
            //sort tuneSet playdate descending  
            this.sets.sort(function (a: TuneSet, b: TuneSet) {
                return (a.getLastPlayDate() > b.getLastPlayDate()) ? -1 : (a.getLastPlayDate() < b.getLastPlayDate()) ? 1 : 0;
            })
            this.sorting = 'playdateDesc';
        }

    }

    sortRandom(e) {
        this.sets = this.tuneBookService.shuffleTuneSetList();
        this.sorting = 'random';
    }

    sortId(e) {

        if (this.sorting !== 'idAsc') {
            //sort tuneSet id ascending  
            this.sets.sort(function (a: TuneSet, b: TuneSet) {
                return a.id - b.id;
            })
            this.sorting = 'idAsc';

        } else if (this.sorting !== 'idDesc') {
            //sort tuneSet id descending  
            this.sets.sort(function (a: TuneSet, b: TuneSet) {
                return b.id - a.id;
            })
            this.sorting = 'idDesc';
        }

    }

    filterSets(e) {
        this.filterSettings.toggleSetIdFilter();
        this.tuneBookService.applyFilter();
    }

    setSelectedPlaylistId(playlist: Playlist) {
        this.selectedPlaylist = playlist;
    }

    addSelectedSetsToSelectedPlaylist() {
        this.tuneBookService.addPlaylistPositions(this.selectedPlaylist.id, this.filterSettings.setIds);
    }
}


