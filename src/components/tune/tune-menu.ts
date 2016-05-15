import {Component, Input} from 'angular2/core';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {EditButtonUI} from '../../components/common/edit-btn';


@Component({
    selector: 'etb-tune-menu',
    templateUrl: './components/tune/tune-menu.html',
    directives: [EditButtonUI],
    styleUrls: ['./components/tune/tune-menu.css'],
})
export class TuneMenuUI {
    @Input() tune: Tune;

    constructor(public tuneBookService: TuneBookService) {

    }
}


