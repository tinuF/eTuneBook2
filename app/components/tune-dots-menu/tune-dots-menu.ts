import {Component, Input, Output, OnInit, DoCheck, EventEmitter} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {FromNow} from '../../pipes/from-now';
import {TuneColorizerUI} from '../tune-colorizer/tune-colorizer';
import {TuneTransposerUI} from '../tune-transposer/tune-transposer';

@Component({
    selector: 'etb-tune-dots-menu',
    templateUrl: './components/tune-dots-menu/tune-dots-menu.html',
    styleUrls: ['./components/tune-dots-menu/tune-dots-menu.css'],
    directives: [ROUTER_DIRECTIVES, TuneColorizerUI, TuneTransposerUI],
    pipes: [FromNow]
})
export class TuneDotsMenuUI implements OnInit, DoCheck {
    @Input() tune: Tune;
    @Output() transposeUp: EventEmitter<any> = new EventEmitter();
    @Output() transposeDown: EventEmitter<any> = new EventEmitter();
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    ngDoCheck() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    deleteTune() {
        // Delete all TuneSetPositions with that tune
        this.tuneBookService.deleteTuneSetPositionsAndTune(this.tune.intTuneId);
        this.router.navigate(['/Tunes']);

        // Put TuneBook to localStorage
        this.tuneBookService.storeTuneBookAbc();
    }

    tuneUp() {
        // Transpose up
        this.transposeUp.next(null);
    }

    tuneDown() {
        // Transpose down
        this.transposeDown.next(null);
    }
}

