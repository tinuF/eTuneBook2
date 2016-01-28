import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneRandomUI} from '../../components/tune-random/tune-random';


@Component({
    selector: 'etb-side-nav',
    providers: [TuneBookService],
    templateUrl: './components/side-nav/side-nav.html',
    styleUrls: ['./components/side-nav/side-nav.css'],
    directives: [ROUTER_DIRECTIVES, TuneRandomUI]
})
export class SideNavigationUI {

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }
}
