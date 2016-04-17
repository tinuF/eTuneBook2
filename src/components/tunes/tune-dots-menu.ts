import {Component, Input, Output, OnInit, DoCheck, EventEmitter} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {FromNow} from '../../pipes/from-now';
import {TuneColorizerUI} from '../tunes/tune-colorizer';
import {TuneTransposerUI} from '../tunes/tune-transposer';

@Component({
    selector: 'etb-tune-dots-menu',
    templateUrl: './components/tunes/tune-dots-menu.html',
    styleUrls: ['./components/tunes/tune-dots-menu.css'],
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
        this.tuneBookService.deleteTune(this.tune.intTuneId);
        this.router.navigate(['/Tunelist']);

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

    newSet(e) {
        this.tuneBookService.initializeTuneSet(this.tune.intTuneId);
        this.tuneBookService.storeTuneBookAbc();
    }

    newVideo(e) {
        this.tuneBookService.addVideo(this.tune.intTuneId, "ytube", "", "0:00: " + this.tune.title);
        this.tuneBookService.storeTuneBookAbc();
    }

    newWebsite(e) {
        this.tuneBookService.addWebsite(this.tune.intTuneId, "");
        this.tuneBookService.storeTuneBookAbc();
    }
}

