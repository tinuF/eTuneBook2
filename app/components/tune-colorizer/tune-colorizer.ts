import {Component, DoCheck} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TunePlayedUI} from '../tune-played/tune-played';
import {FromNow} from '../../pipes/from-now';


@Component({
    selector: 'etb-tune-colorizer',
    inputs: ['tune: tune'],
    templateUrl: './components/tune-colorizer/tune-colorizer.html',
    styleUrls: ['./components/tune-colorizer/tune-colorizer.css'],
    directives: [ROUTER_DIRECTIVES, TunePlayedUI],
    pipes: [FromNow]
})
export class TuneColorizerUI implements DoCheck {
    tune: Tune;

    constructor(public tuneBookService: TuneBookService) {
    }


    ngDoCheck() {
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