import {Component, OnInit, DoCheck} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, Location} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {FromNow} from '../../pipes/from-now';

@Component({
    selector: 'etb-tune-dots-menu',
    inputs: ['tune: tune'],
    templateUrl: './components/tune-dots-menu/tune-dots-menu.html',
    styleUrls: ['./components/tune-dots-menu/tune-dots-menu.css'],
    directives: [ROUTER_DIRECTIVES],
    pipes: [FromNow]
})
export class TuneDotsMenuUI implements OnInit, DoCheck {
    tune: Tune;
    currentState: string;//TODO: check if needed
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService, public location: Location, public router: Router) {

    }

    ngOnInit() {
        this.setCurrentState();
        this.editModus = this.tuneBookService.isEditModus();
    }

    ngDoCheck() {
        this.editModus = this.tuneBookService.isEditModus();
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

