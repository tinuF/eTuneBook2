import { Component } from '@angular/core';

import { TuneBookService } from '../../business/index';


@Component({
    moduleId: module.id,
    selector: 'etb-side-nav',
    templateUrl: 'side-nav.component.html',
    styleUrls: ['side-nav.component.css']
})
export class SideNavigationComponent {

    constructor(public tuneBookService: TuneBookService) {

    }

    scrollTop() {
        window.scrollTo(0, 0);
    }

    scrollBottom() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    showScrollButtons():boolean {
        let verticalScrollBarPresent = false;

        if (document.body.scrollHeight <= document.body.clientHeight) {
            verticalScrollBarPresent = true;
        }

        return verticalScrollBarPresent;
    }
}
