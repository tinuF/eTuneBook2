/// <reference path="../../typings.d.ts" />
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
export class BookUI {
  tuneBook: TuneBook;

  constructor(public tuneBookService: TuneBookService, public router: Router) {
    this.tuneBook =  this.tuneBookService.getTuneBookFromLocalStorage();
  }
  edit() {
    //$state.transitionTo('bookedit', $stateParams);
    this.router.navigate('bookedit');
  }
}
