import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {TuneBookService} from '../../../services/tunebook-service';
import {Tune} from '../../../business/model/tune';
import {TunePlayedUI} from '../../common/tune/tune-played';
import {FromNow} from '../../../pipes/from-now';


@Component({
    selector: 'etb-tune-transposer',
    templateUrl: './components/common/tune/tune-transposer.html',
    styleUrls: ['./components/common/tune/tune-transposer.css'],
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
        this.tuneBookService.tuneUp(this.tune.id);
        this.tuneBookService.storeTuneBookAbc();
        this.transposeUp.next(null);
    }

    tuneDown() {
        // Transpose down
        this.tuneBookService.tuneDown(this.tune.id);
        this.tuneBookService.storeTuneBookAbc();
        this.transposeDown.next(null);
    }
}