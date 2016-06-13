import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TuneBookService } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-randomizer',
    templateUrl: 'tune-randomizer.component.html',
})
export class TuneRandomizerComponent {

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    randomize() {
        let randomTuneId: number = this.tuneBookService.getRandomTuneId();
        this.router.navigate(['/tunes', randomTuneId]);
    }
}

