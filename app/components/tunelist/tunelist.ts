/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgFor, LifecycleEvent} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {Tune} from '../../business/model/tune';
import {getSystemProperties} from '../../common/system-properties';

import {SampleDots} from '../../components/sample-dots/sample-dots';


@Component({
  selector: 'tunelist',
  lifecycle: [LifecycleEvent.onCheck]
})
@View({
  templateUrl: './components/tunelist/tunelist.html?v=<%= VERSION %>',
  directives: [NgFor, SampleDots],
  styleUrls: ['./tunelist.css?v=<%= VERSION %>']
})
export class TuneList {
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


