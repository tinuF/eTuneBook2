/// <reference path="../../typings.d.ts" />
import {Component, Input} from 'angular2/angular2';
import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';


@Component({
  selector: 'etb-book-title',
  templateUrl: './components/book-title/book-title.html',
  styleUrls: ['./components/book-title/book-title.css']
})
export class BookTitleUI {
  @Input() tuneBook: TuneBook;
  
  constructor(public tuneBookService: TuneBookService){
    
  }
  
  onInit(){
    this.tuneBook =  this.tuneBookService.getCurrentTuneBook();
  }
  
  doCheck(){
    this.tuneBook =  this.tuneBookService.getCurrentTuneBook();
  }
  
}
