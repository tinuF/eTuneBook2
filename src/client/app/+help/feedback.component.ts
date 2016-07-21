
import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { InfoMenuComponent } from '../+help/info-menu.component';


@Component({
    moduleId: module.id,
    selector: 'etb-feedback',
    templateUrl: 'feedback.component.html',
    directives: [ROUTER_DIRECTIVES, InfoMenuComponent],
    styleUrls: ['feedback.component.css']
})
export class FeedbackComponent {
    constructor() {
        //console.log('feedback:constructor called');
    }
}
