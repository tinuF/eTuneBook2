/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgFor, LifecycleEvent} from 'angular2/angular2';
import {Router, RouterLink} from 'angular2/router';

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
  directives: [NgFor, RouterLink, SampleDotsUI],
  styleUrls: ['./tunelist.css?v=<%= VERSION %>'],
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
    this.tunes = this.tuneBookService.getTunesFiltered();
  }
}


