import { Component, OnInit, Input } from '@angular/core';

import { TuneBookService, Tune, SortSettings } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-list-menu',
    templateUrl: 'tune-list-menu.component.html',
    styleUrls: ['tune-list-menu.component.css']
})
export class TuneListMenuComponent implements OnInit {
    @Input() tunes: Array<Tune>;
    sortSettings: SortSettings;

    constructor(public tuneBookService: TuneBookService) {
        //console.log('tune-list-menu:constructor called');
    }

    ngOnInit() {
        this.sortSettings = this.tuneBookService.getCurrentSortSettings();
        //Tunes werden mit den Sets eingelesen (SetId aufsteigend)
        //Deshalb hier aufsteigend nach TuneId sortieren
        if (this.sortSettings.tuneListSort === '') {
            this.sortId();
        }

    }

    sortTitle() {
        if (!(this.sortSettings.tuneListSort === 'title') || !this.sortSettings.tuneListAscending) {
            //sort tune title ascending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                let titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase();

                if (titleA < titleB) {
                    return -1;
                }
                if (titleA > titleB) {
                    return 1;
                }
                return 0; //default return value (no sorting)
            });
            this.sortSettings.tuneListSort = 'title';
            this.sortSettings.tuneListAscending = true;

        } else {
            //sort tune title descending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                let titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase();

                if (titleA < titleB) {
                    return 1;
                }
                if (titleA > titleB) {
                    return -1;
                }
                return 0; //default return value (no sorting)
            });
            this.sortSettings.tuneListSort = 'title';
            this.sortSettings.tuneListAscending = false;

        }

        window.scrollTo(0, 0);
    }

    sortPlaydate() {
        if (!(this.sortSettings.tuneListSort === 'playDate') || this.sortSettings.tuneListAscending) {
            //sort tune playdate descending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return (a.lastPlayed > b.lastPlayed) ? -1 : (a.lastPlayed < b.lastPlayed) ? 1 : 0;
            });
            this.sortSettings.tuneListSort = 'playDate';
            this.sortSettings.tuneListAscending = false;
        } else {
            //sort tune playdate ascending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return (a.lastPlayed > b.lastPlayed) ? 1 : (a.lastPlayed < b.lastPlayed) ? -1 : 0;
            });
            this.sortSettings.tuneListSort = 'playDate';
            this.sortSettings.tuneListAscending = true;
        }

        window.scrollTo(0, 0);
    }

    sortRandom() {
        this.tunes = this.tuneBookService.shuffleTuneList();
        this.sortSettings.tuneListSort = 'random';

        window.scrollTo(0, 0);
    }

    sortFrequency() {
        if (!(this.sortSettings.tuneListSort === 'frequency') || this.sortSettings.tuneListAscending) {
            //sort tune playdate descending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return b.frequencyPlayed - a.frequencyPlayed;
            });
            this.sortSettings.tuneListSort = 'frequency';
            this.sortSettings.tuneListAscending = false;
        } else {
            //sort tune frequency ascending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return a.frequencyPlayed - b.frequencyPlayed;
            });
            this.sortSettings.tuneListSort = 'frequency';
            this.sortSettings.tuneListAscending = true;
        }

        window.scrollTo(0, 0);
    }

    sortId() {
        if (!(this.sortSettings.tuneListSort === 'id') || !this.sortSettings.tuneListAscending) {
            //sort tune Id ascending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return a.id - b.id;
            });
            this.sortSettings.tuneListSort = 'id';
            this.sortSettings.tuneListAscending = true;
        } else {
            //sort tune Id descending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return b.id - a.id;
            });
            this.sortSettings.tuneListSort = 'id';
            this.sortSettings.tuneListAscending = false;
        }

        window.scrollTo(0, 0);

    }
}


