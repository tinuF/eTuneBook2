import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';

@Component({
    selector: 'etb-social-nav',
    templateUrl: './components/app/social-nav.html',
    styleUrls: ['./components/app/social-nav.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class SocialNavigationUI {

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }
}
