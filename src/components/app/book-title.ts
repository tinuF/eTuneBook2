import {Component, OnInit} from 'angular2/core';
import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {ACTION} from '../../common/action';

import {Subscription}   from 'rxjs/Subscription';


@Component({
    selector: 'etb-book-title',
    templateUrl: './components/app/book-title.html',
    styleUrls: ['./components/app/book-title.css']
})
export class BookTitleUI implements OnInit {
    tuneBook: TuneBook;
    modelActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.tuneBook = this.tuneBookService.getCurrentTuneBook();
        
        this.modelActionSubscription = this.tuneBookService.modelActionObservable.subscribe(
            (action) => {
                console.log("book-title:modelActionSubscription called: " + action);
                if (action === ACTION.IMPORT_TUNEBOOK || 
                action === ACTION.LOAD_EXAMPLE_TUNEBOOK ||
                action === ACTION.INITIALIZE_TUNEBOOK ||
                action === ACTION.EDIT_TUNEBOOK_NAME ||
                action === ACTION.EDIT_TUNEBOOK_VERSION) {
                    this.tuneBook = this.tuneBookService.getCurrentTuneBook();
                }
            });
    }
}
