import {Component, Input, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';

@Component({
    selector: 'etb-book',
    templateUrl: './components/book/book.html',
    styleUrls: ['./components/book/book.css'],
})
export class BookUI implements OnInit {
    @Input() tuneBook: TuneBook;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.tuneBook = this.tuneBookService.getTuneBookFromLocalStorage();
    }

    handleKeyDownOnTuneBookName(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnTuneBookName(event);
        }
    }

    handleBlurOnTuneBookName(event) {
        this.tuneBook.name = event.target.textContent;
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnTuneBookVersion(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnTuneBookVersion(event);
        }
    }

    handleBlurOnTuneBookVersion(event) {
        this.tuneBook.version = event.target.textContent;
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnTuneBookDescription(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnTuneBookDescription(event);
        }
    }

    handleBlurOnTuneBookDescription(event) {
        this.tuneBook.description = event.target.textContent;
        this.tuneBookService.storeTuneBookAbc();
    }
}
