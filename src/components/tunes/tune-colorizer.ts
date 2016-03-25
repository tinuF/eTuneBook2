import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TunePlayedUI} from '../common/tune-played';
import {FromNow} from '../../pipes/from-now';


@Component({
    selector: 'etb-tune-colorizer',
    templateUrl: './components/tunes/tune-colorizer.html',
    styleUrls: ['./components/tunes/tune-colorizer.css'],
    directives: [ROUTER_DIRECTIVES, TunePlayedUI],
    pipes: [FromNow]
})
export class TuneColorizerUI {
    @Input() tune: Tune;

    constructor(public tuneBookService: TuneBookService) {
    }

    changeRed($event) {
        this.tune.color.red = parseInt($event.target.value);
        this.tune.color.convertRGBtoHex();
        this.tuneBookService.storeTuneBookAbc();
    }

    changeGreen($event) {
        this.tune.color.green = parseInt($event.target.value);
        this.tune.color.convertRGBtoHex();
        this.tuneBookService.storeTuneBookAbc();
    }

    changeBlue($event) {
        this.tune.color.blue = parseInt($event.target.value);
        this.tune.color.convertRGBtoHex();
        this.tuneBookService.storeTuneBookAbc();
    }
}