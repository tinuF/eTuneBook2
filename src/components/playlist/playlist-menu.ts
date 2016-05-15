import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {EditButtonUI} from '../../components/common/edit-btn';


@Component({
    selector: 'etb-playlist-menu',
    templateUrl: './components/playlist/playlist-menu.html',
    directives: [ROUTER_DIRECTIVES, EditButtonUI],
    styleUrls: ['./components/playlist/playlist-menu.css'],
})
export class PlayListMenuUI {

    constructor(public tuneBookService: TuneBookService) {

    }
}


