import {Component, Input, Output, EventEmitter} from 'angular2/core';
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
export class TuneDotsMenuUI {
    @Input() tune: Tune;
    @Output() transposeUp: EventEmitter<any> = new EventEmitter();
    @Output() transposeDown: EventEmitter<any> = new EventEmitter();

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    deleteTune() {
        this.tuneBookService.deleteTune(this.tune.id);
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
        this.tuneBookService.initializeTuneSet(this.tune.id);
        this.tuneBookService.storeTuneBookAbc();
    }

    newVideo(e) {
        this.tuneBookService.addVideo(this.tune.id, "ytube", "", "0:00: " + this.tune.title);
        this.tuneBookService.storeTuneBookAbc();
    }

    newWebsite(e) {
        this.tuneBookService.addWebsite(this.tune.id, "");
        this.tuneBookService.storeTuneBookAbc();
    }
}

