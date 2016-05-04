import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {FromNow} from '../../pipes/from-now';
import {TuneColorizerUI} from '../tunes/tune-colorizer';
import {TuneTransposerUI} from '../tunes/tune-transposer';

@Component({
    selector: 'etb-tune-abc-menu',
    templateUrl: './components/tunes/tune-abc-menu.html',
    styleUrls: ['./components/tunes/tune-abc-menu.css'],
    directives: [ROUTER_DIRECTIVES, TuneColorizerUI, TuneTransposerUI],
    pipes: [FromNow]
})
export class TuneAbcMenuUI implements OnInit {
    @Input() tune: Tune;
    @Output() transposeUp: EventEmitter<any> = new EventEmitter();
    @Output() transposeDown: EventEmitter<any> = new EventEmitter();
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    deleteTune() {
        // Delete all TuneSetPositions with that tune
        this.tuneBookService.deleteTune(this.tune.id);
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

