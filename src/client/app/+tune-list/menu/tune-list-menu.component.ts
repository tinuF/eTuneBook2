import { Component, OnInit, Input } from '@angular/core';

import { TuneBookService, Tune } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-list-menu',
    templateUrl: 'tune-list-menu.component.html',
    styleUrls: ['tune-list-menu.component.css']
})
export class TuneListMenuComponent implements OnInit {
    @Input() tunes: Array<Tune>;
    sorting: string;
    ascending: boolean;

    constructor(public tuneBookService: TuneBookService) {
        //console.log('tune-list-menu:constructor called');
    }

    ngOnInit() {
        //Tunes werden mit den Sets eingelesen (SetId aufsteigend)
        //Deshalb hier aufsteigend nach TuneId sortieren
        this.sortId();
    }

    sortTitle() {
        if (!(this.sorting === 'title') || !this.ascending) {
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
            this.sorting = 'title';
            this.ascending = true;

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
            this.sorting = 'title';
            this.ascending = false;

        }

        window.scrollTo(0, 0);
    }

    sortPlaydate() {
        if (!(this.sorting === 'playDate') || this.ascending) {
            //sort tune playdate descending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return (a.lastPlayed > b.lastPlayed) ? -1 : (a.lastPlayed < b.lastPlayed) ? 1 : 0;
            });
            this.sorting = 'playDate';
            this.ascending = false;
        } else {
            //sort tune playdate ascending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return (a.lastPlayed > b.lastPlayed) ? 1 : (a.lastPlayed < b.lastPlayed) ? -1 : 0;
            });
            this.sorting = 'playDate';
            this.ascending = true;
        }

        window.scrollTo(0, 0);
    }

    sortRandom() {
        this.tunes = this.tuneBookService.shuffleTuneList();
        this.sorting = 'random';

        window.scrollTo(0, 0);
    }

    sortFrequency() {
        if (!(this.sorting === 'frequency') || this.ascending) {
            //sort tune playdate descending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return b.frequencyPlayed - a.frequencyPlayed;
            });
            this.sorting = 'frequency';
            this.ascending = false;
        } else {
            //sort tune frequency ascending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return a.frequencyPlayed - b.frequencyPlayed;
            });
            this.sorting = 'frequency';
            this.ascending = true;
        }

        window.scrollTo(0, 0);
    }

    sortId() {
        if (!(this.sorting === 'id') || !this.ascending) {
            //sort tune Id ascending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return a.id - b.id;
            });
            this.sorting = 'id';
            this.ascending = true;
        } else {
            //sort tune Id descending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return b.id - a.id;
            });
            this.sorting = 'id';
            this.ascending = false;
        }

        window.scrollTo(0, 0);

    }
}


