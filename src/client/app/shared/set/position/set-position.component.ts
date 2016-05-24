import { Component, Input } from '@angular/core';

import { TuneBookService, TuneSetPosition } from '../../../business/index';
import { SetpositionTuneComponent } from '../position/set-position-tune.component';

@Component({
    moduleId: module.id,
    selector: 'etb-set-position',
    templateUrl: 'set-position.component.html',
    directives: [SetpositionTuneComponent],
    styleUrls: ['set-position.component.css']
})
export class SetPositionComponent {
    @Input() position: TuneSetPosition;

    constructor(public tuneBookService: TuneBookService) {

    }
}


