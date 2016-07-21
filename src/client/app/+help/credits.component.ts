import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { InfoMenuComponent } from '../+help/info-menu.component';


@Component({
    moduleId: module.id,
    selector: 'etb-credits',
    templateUrl: 'credits.component.html',
    directives: [ROUTER_DIRECTIVES, InfoMenuComponent],
    styleUrls: ['credits.component.css']
})
export class CreditsComponent {
    constructor() {
        //console.log('credits:constructor called');
    }
}
