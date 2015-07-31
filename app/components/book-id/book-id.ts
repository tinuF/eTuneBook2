/// <reference path="../../typings/_custom.d.ts" />
import {Component, View} from 'angular2/angular2';

import {TuneBook} from '../../business/model/tunebook';

@Component({
  selector: 'tunebook-id',
  //properties: ['tuneBook.name: name', 'tuneBook.version: version']
  properties: ['tuneBook: tunebook']
})
@View({
  templateUrl: './components/book-id/book-id.html?v=<%= VERSION %>',
})
export class TuneBookIdView {
  tuneBook: TuneBook;
  constructor(){
    
  }
  
}
