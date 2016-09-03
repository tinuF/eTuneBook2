import { Component } from '@angular/core';

import { TuneBookService } from './business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-social-nav',
    templateUrl: 'social-nav.component.html',
    styleUrls: ['social-nav.component.css']
})
export class SocialNavigationComponent {

    constructor(public tuneBookService: TuneBookService) {

    }
}
