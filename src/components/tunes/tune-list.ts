import {Component, DoCheck} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TuneListItemUI} from '../../components/tunes/tune-list-item';
import {TuneListMenuUI} from '../../components/tunes/tune-list-menu';


@Component({
    selector: 'etb-tune-list',
    templateUrl: './components/tunes/tune-list.html',
    directives: [ROUTER_DIRECTIVES, TuneListItemUI, TuneListMenuUI],
    styleUrls: ['./components/tunes/tune-list.css'],
})
export class TuneListUI implements DoCheck {
    tunes: Array<Tune>;

    constructor(public tuneBookService: TuneBookService) {
        this.tunes = this.tuneBookService.getTunesFiltered();
    }

    ngDoCheck() {
        //DoCheck needed for text search
        //(für Filter-Panel würde @Input() reichen)
        this.tunes = this.tuneBookService.getTunesFiltered();
    }
}


