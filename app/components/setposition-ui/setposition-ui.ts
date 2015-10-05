/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgFor, ElementRef} from 'angular2/angular2';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSetPosition} from '../../business/model/tunesetposition';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {SampleDotsUI} from '../../components/sample-dots-ui/sample-dots-ui';


@Component({
  selector: 'set-position',
  properties: ['position: position']
})
@View({
  templateUrl: './components/setposition-ui/setposition-ui.html',
  directives: [ROUTER_DIRECTIVES, SampleDotsUI],
  styleUrls: ['./components/setposition-ui/setposition-ui.css'],
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


