/// <reference path="../../typings/_custom.d.ts" />
import {Component, View} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {getSystemProperties} from '../../common/etunebook-system';

import {TuneBookIdView} from '../../components/book-id/book-id';


@Component({
  selector: 'tunelist'
})
@View({
  templateUrl: './components/tunelist/tunelist.html?v=<%= VERSION %>',
  directives: [TuneBookIdView]
})
export class TuneListView {
  tuneBook: TuneBook;
  systemProperties;
 
  constructor(public tuneBookService: TuneBookService, public router: Router) {
    this.systemProperties = getSystemProperties();
    this.tuneBook =  this.tuneBookService.getCurrentTuneBook();
  }
}


