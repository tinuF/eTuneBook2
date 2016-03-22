import {Component, Input, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {EditButtonUI} from '../../components/edit-btn/edit-btn';


@Component({
    selector: 'etb-playlist-menu',
    templateUrl: './components/playlist-menu/playlist-menu.html',
    directives: [ROUTER_DIRECTIVES, EditButtonUI],
    styleUrls: ['./components/playlist-menu/playlist-menu.css'],
})
export class PlayListMenuUI implements OnInit {

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {

    }
}


