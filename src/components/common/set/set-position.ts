import {Component, Input} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../../services/tunebook-service';
import {TuneSetPosition} from '../../../business/model/tunesetposition';
import {EliminateThe} from '../../../pipes/eliminate-the';
import {FromNow} from '../../../pipes/from-now';
import {SetpositionTuneUI} from '../../../components/common/set/set-position-tune';


@Component({
    selector: 'etb-set-position',
    templateUrl: './components/common/set/set-position.html',
    directives: [ROUTER_DIRECTIVES, SetpositionTuneUI],
    styleUrls: ['./components/common/set/set-position.css'],
    pipes: [EliminateThe, FromNow]
})
export class SetPositionUI {
    @Input() position: TuneSetPosition;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }
}


