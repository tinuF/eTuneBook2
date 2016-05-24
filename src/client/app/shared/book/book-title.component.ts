import {Component, OnInit, OnDestroy} from '@angular/core';

import {Subscription} from 'rxjs/Subscription';

import {TuneBookService, TuneBook, ACTION} from '../../business/index';


@Component({
    moduleId: module.id,
    selector: 'etb-book-title',
    templateUrl: 'book-title.component.html',
    styleUrls: ['book-title.component.css']
})
export class BookTitleComponent implements OnInit, OnDestroy {
    tuneBook: TuneBook;
    modelActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.tuneBook = this.tuneBookService.getCurrentTuneBook();

        this.modelActionSubscription = this.tuneBookService.modelActionObservable.subscribe(
            (action) => {
                //console.log('book-title:modelActionSubscription called: ' + action);
                if (action === ACTION.IMPORT_TUNEBOOK ||
                    action === ACTION.LOAD_EXAMPLE_TUNEBOOK ||
                    action === ACTION.INITIALIZE_TUNEBOOK ||
                    action === ACTION.EDIT_TUNEBOOK_NAME ||
                    action === ACTION.EDIT_TUNEBOOK_VERSION) {
                    this.tuneBook = this.tuneBookService.getCurrentTuneBook();
                }
            });
    }

    ngOnDestroy() {
        this.modelActionSubscription.unsubscribe();
    }
}
