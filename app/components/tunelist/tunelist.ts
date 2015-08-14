/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgFor, LifecycleEvent} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {Tune} from '../../business/model/tune';
import {getSystemProperties} from '../../common/system-properties';

import {TuneBookIdView} from '../../components/book-id/book-id';
import {SampleDots} from '../../components/sample-dots/sample-dots';


@Component({
  selector: 'tunelist',
  lifecycle: [LifecycleEvent.onInit]
})
@View({
  templateUrl: './components/tunelist/tunelist.html?v=<%= VERSION %>',
  directives: [NgFor, TuneBookIdView, SampleDots],
  styleUrls: ['./tunelist.css?v=<%= VERSION %>']
})
export class TuneList {
  tuneBook: TuneBook;
  tunes: Array<Tune>;
  systemProperties;
 
  constructor(public tuneBookService: TuneBookService, public router: Router) {
    this.systemProperties = getSystemProperties();
    this.tuneBook =  this.tuneBookService.getCurrentTuneBook();
  }
  
  onInit() {
    //getTunesFiltered() depends on FilterSettings, which might have been modified under /filter
    //TODO: Liste eventuell nur neu laden, wenn in den FilterSettings was geändert hat. 
    this.tunes = this.tuneBookService.getTunesFiltered();
  };
}


