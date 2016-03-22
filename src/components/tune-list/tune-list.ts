import {Component, DoCheck} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TuneListItemUI} from '../../components/tune-list-item/tune-list-item';
import {TuneListMenuUI} from '../../components/tune-list-menu/tune-list-menu';


@Component({
    selector: 'etb-tune-list',
    templateUrl: './components/tune-list/tune-list.html',
    directives: [ROUTER_DIRECTIVES, TuneListItemUI, TuneListMenuUI],
    styleUrls: ['./components/tune-list/tune-list.css'],
})
export class TuneListUI implements DoCheck {
    tunes: Array<Tune>;

    constructor(public tuneBookService: TuneBookService) {
        this.tunes = this.tuneBookService.getTunesFiltered();
    }

    ngDoCheck() {
        this.tunes = this.tuneBookService.getTunesFiltered();
    }
}


