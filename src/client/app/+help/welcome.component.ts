import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { InfoMenuComponent } from '../+help/info-menu.component';


@Component({
    moduleId: module.id,
    selector: 'etb-welcome',
    templateUrl: 'welcome.component.html',
    directives: [ROUTER_DIRECTIVES, InfoMenuComponent],
    styleUrls: ['welcome.component.css']
})
export class WelcomeComponent {
    constructor() {

    }
}
