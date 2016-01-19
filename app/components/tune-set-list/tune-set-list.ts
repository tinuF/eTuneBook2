import {Component, OnInit, DoCheck} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TuneSet} from '../../business/model/tuneset';

import {SetListItemUI} from '../../components/set-list-item/set-list-item';


@Component({
    selector: 'etb-tune-set-list',
    inputs: ['tune'],
    templateUrl: './components/tune-set-list/tune-set-list.html',
    styleUrls: ['./components/tune-set-list/tune-set-list.css'],
    directives: [ROUTER_DIRECTIVES, SetListItemUI]
})
export class TuneSetListUI implements OnInit, DoCheck {
    tune: Tune;
    sets: Array<TuneSet>;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.sets = this.tuneBookService.getTuneSetsByIntTuneId(this.tune.intTuneId);
    }

    ngDoCheck() {
        this.sets = this.tuneBookService.getTuneSetsByIntTuneId(this.tune.intTuneId);
    }
}


