/// <reference path="../../typings.d.ts" />
import {Component, View, NgFor, ElementRef} from 'angular2/angular2';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {SampleDotsUI} from '../../components/sample-dots/sample-dots';
import {SetPositionUI} from '../../components/setposition/setposition';


@Component({
  selector: 'setlist-item',
  inputs: ['set: set']
})
@View({
  templateUrl: './components/setlist-item/setlist-item.html',
  directives: [ROUTER_DIRECTIVES, NgFor, SampleDotsUI, SetPositionUI],
  styleUrls: ['./components/setlist-item/setlist-item.css'],
  pipes: [EliminateThe, FromNow]
})
export class SetListItemUI {
  set: TuneSet;
  
  constructor(public tuneBookService: TuneBookService, public router: Router, public elementRef: ElementRef) {
    
  }
  
  onInit() {
    //needs jQuery UI
    //jQuery(this.elementRef.nativeElement).draggable({containment:'#draggable-parent'});
  }
  
  justPlayedTheSet() {
		var now = new Date();
		this.tuneBookService.addTuneSetPlayDate(this.set, now);
		this.tuneBookService.storeTuneBookAbc();
	};
}

