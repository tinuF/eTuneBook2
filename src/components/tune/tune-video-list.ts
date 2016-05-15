import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TuneVideoListItemUI} from '../../components/tune/tune-video-list-item';


@Component({
    selector: 'etb-tune-video-list',
    templateUrl: './components/tune/tune-video-list.html',
    styleUrls: ['./components/tune/tune-video-list.css'],
    directives: [ROUTER_DIRECTIVES, TuneVideoListItemUI]
})
export class TuneVideoListUI {
    @Input() tune: Tune;

    constructor(public tuneBookService: TuneBookService) {

    }
}


