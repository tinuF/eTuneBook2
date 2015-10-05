/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, ElementRef} from 'angular2/angular2';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {Tune} from '../../business/model/tune';
import {getSystemProperties} from '../../common/system-properties';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {SampleDotsUI} from '../../components/sample-dots-ui/sample-dots-ui';


@Component({
  selector: 'tunelist-item',
  properties: ['tune: tune']
})
@View({
  templateUrl: './components/tunelist-item-ui/tunelist-item-ui.html',
  directives: [ROUTER_DIRECTIVES, SampleDotsUI],
  styleUrls: ['./components/tunelist-item-ui/tunelist-item-ui.css'],
  pipes: [EliminateThe, FromNow]
})
export class TuneListItemUI {
  tune: Tune;
  
  constructor(public tuneBookService: TuneBookService, public router: Router, public elementRef: ElementRef) {
    
  }
  
  onInit() {
    //needs jQuery UI
    //jQuery(this.elementRef.nativeElement).draggable({containment:'#draggable-parent'});
  }
}


