/// <reference path="../../typings/_custom.d.ts" />
import {Component, View} from 'angular2/angular2';

import {TuneBookService} from '../../services/tunebook-service';

import {TuneBook} from '../../business/model/tunebook';


@Component({
  selector: 'book-title'
})
@View({
  templateUrl: './components/book-title-ui/book-title-ui.html',
  styleUrls: ['./components/book-title-ui/book-title-ui.css']
})
export class BookTitleUI {
  tuneBook: TuneBook;
  
  constructor(public tuneBookService: TuneBookService){
    this.tuneBook =  this.tuneBookService.getCurrentTuneBook();
  }
  
}
