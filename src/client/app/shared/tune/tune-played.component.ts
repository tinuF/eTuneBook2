import { Component, Input } from '@angular/core';

import { TuneBookService, Tune } from '../../business/index';
//import { FromNowPipe } from '../pipes/index';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-played',
    templateUrl: 'tune-played.component.html',
    styleUrls: ['tune-played.component.css']
})
export class TunePlayedComponent {
    @Input() tune: Tune;

    constructor(public tuneBookService: TuneBookService) {

    }

    justPlayedTheTune() {
        this.tuneBookService.addTunePlayDate(this.tune);
    }
}

