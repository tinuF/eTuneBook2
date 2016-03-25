import {Component, OnInit, Input} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {SampleDotsUI} from '../../components/common/sample-dots';
import {TunePlayedUI} from '../../components/common/tune-played';

@Component({
    selector: 'etb-tune-list-item',
    templateUrl: './components/tunes/tune-list-item.html',
    directives: [ROUTER_DIRECTIVES, SampleDotsUI, TunePlayedUI],
    styleUrls: ['./components/tunes/tune-list-item.css'],
    pipes: [EliminateThe, FromNow]
})
export class TuneListItemUI implements OnInit {
    @Input() tune: Tune;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        //needs jQuery UI
        //jQuery(this.elementRef.nativeElement).draggable({containment:'#draggable-parent'});
    }
}


