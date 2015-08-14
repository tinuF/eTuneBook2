/// <reference path="../../typings/_custom.d.ts" />
import {Component, View} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {getSystemProperties} from '../../common/system-properties';

import {TuneBookIdView} from '../../components/book-id/book-id';


@Component({
  selector: 'setlist'
})
@View({
  templateUrl: './components/setlist/setlist.html?v=<%= VERSION %>',
  directives: [TuneBookIdView]
})
export class TuneSetListView {
  tuneBook: TuneBook;
  systemProperties;
 
  constructor(public tuneBookService: TuneBookService, public router: Router) {
    this.systemProperties = getSystemProperties();
    this.tuneBook =  this.tuneBookService.getCurrentTuneBook();
  }
}


