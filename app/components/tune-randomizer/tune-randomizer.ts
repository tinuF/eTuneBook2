import {Component} from 'angular2/core';
import {Router, RouterLink} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';

@Component({
    selector: 'etb-tune-randomizer',
    templateUrl: './components/tune-randomizer/tune-randomizer.html',
    directives: [RouterLink]
})
export class TuneRandomizerUI {

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }


    randomize(e) {
        let randomTuneId: number = this.tuneBookService.getRandomIntTuneId();
        this.router.navigate(["/Tune", { id: randomTuneId }]);
    }
}

