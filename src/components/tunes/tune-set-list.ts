import {Component, OnInit, DoCheck, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TuneSet} from '../../business/model/tuneset';

import {SetListItemUI} from '../../components/sets/set-list-item';


@Component({
    selector: 'etb-tune-set-list',
    templateUrl: './components/tunes/tune-set-list.html',
    styleUrls: ['./components/tunes/tune-set-list.css'],
    directives: [ROUTER_DIRECTIVES, SetListItemUI]
})
export class TuneSetListUI implements OnInit, DoCheck {
    @Input() tune: Tune;
    sets: Array<TuneSet>;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.sets = this.tuneBookService.getTuneSetsByTuneId(this.tune.id);
    }

    ngDoCheck() {
        this.sets = this.tuneBookService.getTuneSetsByTuneId(this.tune.id);
    }
}


