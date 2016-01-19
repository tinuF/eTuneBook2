import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TuneVideoListItemUI} from '../../components/tune-video-list-item/tune-video-list-item';


@Component({
    selector: 'tune-video-list',
    inputs: ['tune: tune'],
    templateUrl: './components/tune-video-list/tune-video-list.html',
    styleUrls: ['./components/tune-video-list/tune-video-list.css'],
    directives: [ROUTER_DIRECTIVES, TuneVideoListItemUI]
})
export class TuneVideoListUI {
    tune: Tune;

    constructor(public tuneBookService: TuneBookService) {

    }
}


