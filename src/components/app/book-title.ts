import {Component, Input, OnInit, DoCheck} from 'angular2/core';
import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';


@Component({
    selector: 'etb-book-title',
    templateUrl: './components/app/book-title.html',
    styleUrls: ['./components/app/book-title.css']
})
export class BookTitleUI implements OnInit, DoCheck {
    @Input() tuneBook: TuneBook;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.tuneBook = this.tuneBookService.getCurrentTuneBook();
    }

    ngDoCheck() {
        this.tuneBook = this.tuneBookService.getCurrentTuneBook();
    }

}