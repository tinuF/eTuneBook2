import {Component, ElementRef, OnInit} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {SampleDotsUI} from '../../components/sample-dots/sample-dots';
import {TunePlayedUI} from '../../components/tune-played/tune-played';

@Component({
    selector: 'etb-tune-list-item',
    inputs: ['tune: tune'],
    templateUrl: './components/tune-list-item/tune-list-item.html',
    directives: [ROUTER_DIRECTIVES, SampleDotsUI, TunePlayedUI],
    styleUrls: ['./components/tune-list-item/tune-list-item.css'],
    pipes: [EliminateThe, FromNow]
})
export class TuneListItemUI implements OnInit {
    tune: Tune;

    constructor(public tuneBookService: TuneBookService, public router: Router, public elementRef: ElementRef) {

    }

    ngOnInit() {
        //needs jQuery UI
        //jQuery(this.elementRef.nativeElement).draggable({containment:'#draggable-parent'});
    }
}


