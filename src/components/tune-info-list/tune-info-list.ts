import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TuneInfoListItemUI} from '../../components/tune-info-list-item/tune-info-list-item';


@Component({
    selector: 'etb-tune-info-list',
    templateUrl: './components/tune-info-list/tune-info-list.html',
    styleUrls: ['./components/tune-info-list/tune-info-list.css'],
    directives: [ROUTER_DIRECTIVES, TuneInfoListItemUI]
})
export class TuneInfoListUI {
    @Input() tune: Tune;

    constructor(public tuneBookService: TuneBookService) {

    }
}


