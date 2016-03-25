import {Component, DoCheck} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {SetListItemUI} from '../../components/sets/set-list-item';
import {SetListMenuUI} from '../../components/sets/set-list-menu';


@Component({
    selector: 'etb-set-list',
    templateUrl: './components/sets/set-list.html',
    directives: [ROUTER_DIRECTIVES, SetListItemUI, SetListMenuUI],
    styleUrls: ['./components/sets/set-list.css']
})
export class SetListUI implements DoCheck {
    sets: Array<TuneSet>;

    constructor(public tuneBookService: TuneBookService) {
        this.sets = this.tuneBookService.getTuneSetsFiltered();
    }

    ngDoCheck() {
        this.sets = this.tuneBookService.getTuneSetsFiltered();
    }
}


