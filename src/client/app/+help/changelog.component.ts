import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { InfoMenuComponent } from '../+help/index';

@Component({
    moduleId: module.id,
    selector: 'etb-changelog',
    templateUrl: 'changelog.component.html',
    directives: [ROUTER_DIRECTIVES, InfoMenuComponent],
    styleUrls: ['changelog.component.css']
})
export class ChangeLogComponent {
    constructor() {
        //console.log('changelog:constructor called');
    }
}
