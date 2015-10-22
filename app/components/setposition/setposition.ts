/// <reference path="../../typings.d.ts" />
import {Component, View, NgFor, ElementRef} from 'angular2/angular2';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSetPosition} from '../../business/model/tunesetposition';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {TuneListItemUI} from '../../components/tune-list-item/tune-list-item';


@Component({
  selector: 'set-position',
  inputs: ['position: position']
})
@View({
  templateUrl: './components/setposition/setposition.html',
  directives: [ROUTER_DIRECTIVES, TuneListItemUI],
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


