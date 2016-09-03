import { Component, Input } from '@angular/core';

import { Tune } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-menu',
    templateUrl: 'tune-menu.component.html',
    styleUrls: ['tune-menu.component.css'],
})
export class TuneMenuComponent {
    @Input() tune: Tune;

    constructor() {
        //console.log('tune-menu:constructor called');
    }
}


