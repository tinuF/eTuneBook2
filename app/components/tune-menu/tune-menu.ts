import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {EditButtonUI} from '../../components/edit-btn/edit-btn';


@Component({
    selector: 'etb-tune-menu',
    templateUrl: './components/tune-menu/tune-menu.html',
    directives: [ROUTER_DIRECTIVES, EditButtonUI],
    styleUrls: ['./components/tune-menu/tune-menu.css'],
})
export class TuneMenuUI implements OnInit {
    
    constructor(public tuneBookService: TuneBookService) {
        
    }

    ngOnInit() {

    }
}


