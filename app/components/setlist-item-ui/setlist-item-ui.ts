/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgFor, ElementRef} from 'angular2/angular2';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {SampleDotsUI} from '../../components/sample-dots-ui/sample-dots-ui';
import {SetPositionUI} from '../../components/setposition-ui/setposition-ui';


@Component({
  selector: 'setlist-item',
  properties: ['set: set']
})
@View({
  templateUrl: './components/setlist-item-ui/setlist-item-ui.html',
  directives: [ROUTER_DIRECTIVES, NgFor, SampleDotsUI, SetPositionUI],
  styleUrls: ['./components/setlist-item-ui/setlist-item-ui.css'],
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
}


