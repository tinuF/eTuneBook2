import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, Location} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {FromNow} from '../../pipes/from-now';


@Component({
    selector: 'etb-tune-menu',
    inputs: ['tune: tune'],
    templateUrl: './components/tune-menu/tune-menu.html',
    styleUrls: ['./components/tune-menu/tune-menu.css'],
    directives: [ROUTER_DIRECTIVES],
    pipes: [FromNow]
})
export class TuneMenuUI implements OnInit {
    tune: Tune;
    currentState: string;

    constructor(public tuneBookService: TuneBookService, public location: Location, public router: Router) {

    }

    ngOnInit() {
        this.setCurrentState();
    }

    setCurrentState() {
        let path = this.location.path();

        if (path.indexOf('/tunes/' + this.tune.intTuneId + '/abc', 0) >= 0) {
            this.currentState = "Abc";
        } else if (path.indexOf('/tunes/' + this.tune.intTuneId, 0) >= 0) {
            this.currentState = "Dots";
        }
    }

    newSet(e) {
        this.tuneBookService.initializeTuneSet(this.tune.intTuneId);
        this.tuneBookService.storeTuneBookAbc();
    }

    deleteTune() {
        // Delete all TuneSetPositions with that tune
        this.tuneBookService.deleteTuneSetPositionsAndTune(this.tune.intTuneId);
        this.router.navigate(['/Tunes']);

        // Put TuneBook to localStorage
        this.tuneBookService.storeTuneBookAbc();
    }
}

