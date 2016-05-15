import {Component, Input} from 'angular2/core';
import {TuneBookService} from '../../../services/tunebook-service';
import {Tune} from '../../../business/model/tune';
import {FromNow} from '../../../pipes/from-now';


@Component({
    selector: 'etb-tune-played',
    templateUrl: './components/common/tune/tune-played.html',
    styleUrls: ['./components/common/tune/tune-played.css'],
    pipes: [FromNow]
})
export class TunePlayedUI {
    @Input() tune: Tune;

    constructor(public tuneBookService: TuneBookService) {

    }

    justPlayedTheTune() {
        var now = new Date();
        this.tuneBookService.addTunePlayDate(this.tune, now);
        this.tuneBookService.storeTuneBookAbc();
    }
}

