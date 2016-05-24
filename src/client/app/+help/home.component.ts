import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { InfoMenuComponent } from '../+help/info-menu.component';


@Component({
    moduleId: module.id,
    selector: 'etb-home',
    templateUrl: 'home.component.html',
    directives: [ROUTER_DIRECTIVES, InfoMenuComponent],
    styleUrls: ['home.component.css']
})
export class HomeComponent {
    constructor() {

    }
}
