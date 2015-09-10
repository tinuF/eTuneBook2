/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgFor, LifecycleEvent} from 'angular2/angular2';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {Tune} from '../../business/model/tune';
import {getSystemProperties} from '../../common/system-properties';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {SampleDotsUI} from '../../components/sample-dots-ui/sample-dots-ui';


@Component({
  selector: 'tunelist',
  lifecycle: [LifecycleEvent.onCheck]
})
@View({
  templateUrl: './components/tunelist-ui/tunelist-ui.html?v=<%= VERSION %>',
  directives: [NgFor, ROUTER_DIRECTIVES, SampleDotsUI],
  styleUrls: ['./components/tunelist-ui/tunelist-ui.css?v=<%= VERSION %>'],
  pipes: [EliminateThe, FromNow]
})
export class TuneListUI {
  tuneBook: TuneBook;
  tunes: Array<Tune>;
  systemProperties;
 
  constructor(public tuneBookService: TuneBookService, public router: Router) {
    this.systemProperties = getSystemProperties();
    this.tuneBook =  this.tuneBookService.getCurrentTuneBook();
    this.tunes = this.tuneBookService.getTunesFiltered();
  }
  
  onCheck(){
    //todo: this does not work properly with text-search (might be called to often?)
    //with filter it works fine
    //example: text-search 'derry' among slip-jigs gives Dever the Dancer, Humours of Derrycrossane, Slide from Grace
    //(mixture-search 'de' and 'derry')
    this.tunes = this.tuneBookService.getTunesFiltered();
  }
}


