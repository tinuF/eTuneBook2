import {Component, Input} from 'angular2/core';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {EditButtonUI} from '../../components/common/edit-btn';


@Component({
    selector: 'etb-tune-menu',
    templateUrl: './components/tunes/tune-menu.html',
    directives: [EditButtonUI],
    styleUrls: ['./components/tunes/tune-menu.css'],
})
export class TuneMenuUI {
    @Input() tune: Tune;

    constructor(public tuneBookService: TuneBookService) {

    }
}


