import { Component, Input } from '@angular/core';

import { TuneBookService, TuneSetPosition } from '../../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-set-position',
    templateUrl: 'set-position.component.html',
    styleUrls: ['set-position.component.css']
})
export class SetPositionComponent {
    @Input() position: TuneSetPosition;

    constructor(public tuneBookService: TuneBookService) {

    }
}


