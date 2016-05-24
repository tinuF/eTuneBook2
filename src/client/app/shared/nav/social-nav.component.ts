import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { TuneBookService } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-social-nav',
    templateUrl: 'social-nav.component.html',
    styleUrls: ['social-nav.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class SocialNavigationComponent {

    constructor(public tuneBookService: TuneBookService) {

    }
}
