/// <reference path="../../typings.d.ts" />
import {Component, View, NgFor, ElementRef} from 'angular2/angular2';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {TuneSetPosition} from '../../business/model/tunesetposition';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {SampleDotsUI} from '../../components/sample-dots/sample-dots';
import {SetPositionUI} from '../../components/setposition/setposition';


@Component({
  selector: 'etb-set-list-item',
  inputs: ['set'],
  templateUrl: './components/set-list-item/set-list-item.html',
  directives: [ROUTER_DIRECTIVES, NgFor, SampleDotsUI, SetPositionUI],
  styleUrls: ['./components/set-list-item/set-list-item.css'],
  pipes: [EliminateThe, FromNow]
})
export class SetListItemUI {
  set: TuneSet;
  
  constructor(public tuneBookService: TuneBookService, public router: Router, public elementRef: ElementRef) {
    
  }
  
  onInit() {
    //needs jQuery UI
    //jQuery(this.elementRef.nativeElement).draggable({containment:'#draggable-parent'});
    this.sortSetPosition();
  }
  
  justPlayedTheSet() {
		var now = new Date();
		this.tuneBookService.addTuneSetPlayDate(this.set, now);
		this.tuneBookService.storeTuneBookAbc();
	}
  
  sortSetPosition(){
    this.set.tuneSetPositions.sort(function(a:TuneSetPosition, b:TuneSetPosition) {
        return a.position - b.position
    })
  }
}


