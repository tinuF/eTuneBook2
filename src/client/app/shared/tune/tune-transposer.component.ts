import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TuneBookService, Tune  } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-transposer',
    templateUrl: 'tune-transposer.component.html',
    styleUrls: ['tune-transposer.component.css']
})
export class TuneTransposerComponent {
    @Input() tune: Tune;
    @Output() transposeUp: EventEmitter<any> = new EventEmitter();
    @Output() transposeDown: EventEmitter<any> = new EventEmitter();

    constructor(public tuneBookService: TuneBookService) {
    }

    tuneUp() {
        // Transpose up
        this.tuneBookService.tuneUp(this.tune.id);
        this.tuneBookService.storeTuneBookAbc();
        this.transposeUp.next(null);
    }

    tuneDown() {
        // Transpose down
        this.tuneBookService.tuneDown(this.tune.id);
        this.tuneBookService.storeTuneBookAbc();
        this.transposeDown.next(null);
    }
}
