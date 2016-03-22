import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TunePlayedUI} from '../tune-played/tune-played';
import {FromNow} from '../../pipes/from-now';


@Component({
    selector: 'etb-tune-transposer',
    templateUrl: './components/tune-transposer/tune-transposer.html',
    styleUrls: ['./components/tune-transposer/tune-transposer.css'],
    directives: [ROUTER_DIRECTIVES, TunePlayedUI],
    pipes: [FromNow]
})
export class TuneTransposerUI {
    @Input() tune: Tune;
    @Output() transposeUp: EventEmitter<any> = new EventEmitter();
    @Output() transposeDown: EventEmitter<any> = new EventEmitter();
    
    constructor(public tuneBookService: TuneBookService) {
    }

    tuneUp() {
        // Transpose up
        this.tuneBookService.tuneUp(this.tune.intTuneId);
        this.tuneBookService.storeTuneBookAbc();
        this.transposeUp.next(null);
    }

    tuneDown() {
        // Transpose down
        this.tuneBookService.tuneDown(this.tune.intTuneId);
        this.tuneBookService.storeTuneBookAbc();
        this.transposeDown.next(null);
    }
}