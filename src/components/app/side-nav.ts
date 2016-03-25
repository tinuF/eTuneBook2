import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneRandomizerUI} from '../../components/app/tune-randomizer';


@Component({
    selector: 'etb-side-nav',
    templateUrl: './components/app/side-nav.html',
    styleUrls: ['./components/app/side-nav.css'],
    directives: [ROUTER_DIRECTIVES, TuneRandomizerUI]
})
export class SideNavigationUI {

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }
}
