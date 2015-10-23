/// <reference path="../../typings.d.ts" />
import {Component, View, ElementRef} from 'angular2/angular2';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {Tune} from '../../business/model/tune';
import {getSystemProperties} from '../../common/system-properties';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {SampleDotsUI} from '../../components/sample-dots/sample-dots';


@Component({
  selector: 'setposition-tune',
  inputs: ['tune: tune']
})
@View({
  templateUrl: './components/setposition-tune/setposition-tune.html',
  directives: [ROUTER_DIRECTIVES, SampleDotsUI],
  styleUrls: ['./components/setposition-tune/setposition-tune.css'],
  pipes: [EliminateThe, FromNow]
})
export class SetpositionTuneUI {
  tune: Tune;
  
  constructor(public tuneBookService: TuneBookService, public router: Router, public elementRef: ElementRef) {
    
  }
  
  onInit() {
    //needs jQuery UI
    //jQuery(this.elementRef.nativeElement).draggable({containment:'#draggable-parent'});
  }
  
  justPlayedTheTune() {
    var now = new Date();
    this.tuneBookService.addTunePlayDate(this.tune, now);
    this.tuneBookService.storeTuneBookAbc();
  }
}


