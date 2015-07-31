/// <reference path="../../../tsd_typings/tsd.d.ts" />

import {Component, View} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';

@Component({
  selector: 'book',
})
@View({
  templateUrl: './components/book/book.html'
})
export class Book {
  tuneBook: TuneBook;

  constructor(public tuneBookService: TuneBookService, public router: Router) {
    this.tuneBook =  this.tuneBookService.getTuneBookFromLocalStorage();
  }
  edit() {
    //$state.transitionTo('bookedit', $stateParams);
    this.router.navigate('bookedit');
  }
}
