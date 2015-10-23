/// <reference path="../../typings.d.ts" />
import {Component, View, NgFor, ElementRef} from 'angular2/angular2';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSetPosition} from '../../business/model/tunesetposition';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {SetpositionTuneUI} from '../../components/setposition-tune/setposition-tune';


@Component({
  selector: 'set-position',
  inputs: ['position: position']
})
@View({
  templateUrl: './components/setposition/setposition.html',
  directives: [ROUTER_DIRECTIVES, SetpositionTuneUI],
  styleUrls: ['./components/setposition/setposition.css'],
  pipes: [EliminateThe, FromNow]
})
export class SetPositionUI {
  position: TuneSetPosition;
  
  constructor(public tuneBookService: TuneBookService, public router: Router, public elementRef: ElementRef) {
    
  }
  
  onInit() {
    //needs jQuery UI
    //jQuery(this.elementRef.nativeElement).draggable({containment:'#draggable-parent'});
  }
}


