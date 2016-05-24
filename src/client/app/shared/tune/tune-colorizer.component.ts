import { Component, Input } from '@angular/core';

import { TuneBookService, Tune } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-colorizer',
    templateUrl: 'tune-colorizer.component.html',
    styleUrls: ['tune-colorizer.component.css']
})
export class TuneColorizerComponent {
    @Input() tune: Tune;

    constructor(public tuneBookService: TuneBookService) {
    }

    changeRed($event) {
        this.tune.color.red = parseInt($event.target.value);
        this.tune.color.convertRGBtoHex();
        this.tuneBookService.storeTuneBookAbc();
    }

    changeGreen($event) {
        this.tune.color.green = parseInt($event.target.value);
        this.tune.color.convertRGBtoHex();
        this.tuneBookService.storeTuneBookAbc();
    }

    changeBlue($event) {
        this.tune.color.blue = parseInt($event.target.value);
        this.tune.color.convertRGBtoHex();
        this.tuneBookService.storeTuneBookAbc();
    }
}