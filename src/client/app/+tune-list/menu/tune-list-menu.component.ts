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

    constructor(public tuneBookService: TuneBookService) {
        console.log('tune-list-menu:constructor called');
    }

    ngOnInit() {
        //Tunes werden mit den Sets eingelesen (SetId aufsteigend)
        //Deshalb hier aufsteigend nach TuneId sortieren
        this.sortId();
    }

    sortTitle() {

        if (this.sorting !== 'titleAsc') {
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
            this.sorting = 'titleAsc';

        } else if (this.sorting !== 'titleDesc') {
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
            this.sorting = 'titleDesc';
        }

    }

    sortPlaydate() {

        if (this.sorting !== 'playdateAsc') {
            //sort tune playdate ascending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return (a.lastPlayed > b.lastPlayed) ? 1 : (a.lastPlayed < b.lastPlayed) ? -1 : 0;
            });
            this.sorting = 'playdateAsc';

        } else if (this.sorting !== 'playdateDesc') {
            //sort tune playdate descending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return (a.lastPlayed > b.lastPlayed) ? -1 : (a.lastPlayed < b.lastPlayed) ? 1 : 0;
            });
            this.sorting = 'playdateDesc';
        }

    }

    sortRandom() {
        this.tunes = this.tuneBookService.shuffleTuneList();
        this.sorting = 'random';
    }

    sortFrequency() {
        if (this.sorting !== 'frequencyAsc') {
            //sort tune frequency ascending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return a.frequencyPlayed - b.frequencyPlayed;
            });
            this.sorting = 'frequencyAsc';

        } else if (this.sorting !== 'frequencyDesc') {
            //sort tune playdate descending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return b.frequencyPlayed - a.frequencyPlayed;
            });
            this.sorting = 'frequencyDesc';
        }
    }

    sortId() {

        if (this.sorting !== 'idAsc') {
            //sort tune Id ascending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return a.id - b.id;
            });
            this.sorting = 'idAsc';

        } else if (this.sorting !== 'idDesc') {
            //sort tune Id descending  
            this.tunes.sort(function (a: Tune, b: Tune) {
                return b.id - a.id;
            });
            this.sorting = 'idDesc';
        }

    }
}


