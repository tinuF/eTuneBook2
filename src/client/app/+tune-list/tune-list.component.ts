import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, Tune, ACTION } from '../business/index';
import { SpinnerComponent } from '../shared/nav/spinner.component';
import { TuneListItemComponent } from './item/tune-list-item.component';
import { TuneListMenuComponent } from './menu/tune-list-menu.component';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-list',
    templateUrl: 'tune-list.component.html',
    directives: [TuneListItemComponent, TuneListMenuComponent, SpinnerComponent],
    styleUrls: ['tune-list.component.css'],
})
export class TuneListComponent implements OnInit, OnDestroy, AfterViewInit {
    tunes: Array<Tune>;
    isRendering: boolean;
    filterActionSubscription: Subscription;
    modelActionSubscription: Subscription;
    routerSubscription: Subscription;
    selectedId: number;

    constructor(public tuneBookService: TuneBookService, private cdr: ChangeDetectorRef) {
        //console.log('tune-list:constructor called');
    }

    ngOnInit() {
        // we need to detach the change detector initially, to prevent a
        // 'changed after checked' error.

        //this.cdr.detach();
        this.isRendering = true;
        // this.tuneBookService.isRendering() wird gebraucht, damit auf dieser Stufe cdr.detach() nicht nötig
        // warum ist unklar
        this.tuneBookService.isRendering();
        this.tunes = this.tuneBookService.getTunesFiltered();

        this.filterActionSubscription = this.tuneBookService.filterActionObservable.subscribe(
            (action) => {
                //console.log('tune-list:filterActionSubscription called: ' + action);

                if (action === ACTION.APPLY_FILTER) {
                    this.tunes = this.tuneBookService.getTunesFiltered();
                }
            });

        this.modelActionSubscription = this.tuneBookService.modelActionObservable.subscribe(
            (action) => {
                //console.log('tune-list:modelActionSubscription called: ' + action);

                if (action === ACTION.IMPORT_TUNEBOOK ||
                    action === ACTION.LOAD_EXAMPLE_TUNEBOOK ||
                    action === ACTION.INITIALIZE_TUNEBOOK) {

                    this.tunes = this.tuneBookService.getTunesFiltered();
                }
            });
        //console.log('tune-list:ngOnInit called');
    }
    /*
    //ngDoCheck() {
        //Kompoponenten, die gleichzeitig mit der Tune-List angezeigt werden
        //(Text-Search, Sortier-Buttons), lösen asynchrone Funktionen aus.
        //Nach Beendigung dieser asynchronen Funktionen wird mit Hilfe eines  
        //Zone.js-hooks die Change-Detection von Angular durchlaufen, und 
        //zwar für alle Komponenten, die angezeigt werden (alle anderen Komponenten existieren nicht!).
        //Bei @Input prüft Angular neue Referenzen, und zwar für alle im Template
        //vorkommenenden Bindings. @Input funktioniert aber nicht bei Router-Outlet.
        //Also muss via ngDoCheck die in den Ausgangskomponenten geänderte 
        //Tune-Liste hier neu gesetzt werden.
        //Hinweise: 
        //1) Wird von der Tune-List weg-navigiert (zum Beispiel Tune oder Filter);
        //   dann wird TuneListUI zerstört! Eine Änderung im Filter bewirkt also 
        //   kein Aufruf der ngDoCheck-Methode weil die Komponente zu diesem 
        //   Zeitpunkt gar nicht existiert. Bei der erneuten Auswahl von Tunes
        //   wird die Komponente TuneListUI wieder generiert, und im Konstruktor die 
        //   zuvor durch den Filter gesetzte Tune-Liste gesetzt. 
        //2) Normalerweise wird pro Click auf einen Button oder pro Buchstabe, der im 
        //   Text-Search eingegeben wird, ngDoCheck aufgerufen.
        //   Beim Rendern durch ABCJS werden offenbar viel asynchrone Funktionen in die Event-Queue gestellt,
        //   was bewirkt, dass dann ngDoCheck viel aufgerufen wird (ein Tune öffnen -> etwa 42x ngDoCheck). 
        //3) Der Versuch, mittels routerCanReuse die Zerstörung der Komponente zu verhindern, hat nicht funktioniert. 
        //   Scheint nur gedacht zu sein, wenn die gleiche Komponente hintereinander durch zwei verschiedene url
        //   aufgerufen wird (zum Beispiel next Detail). TODO: Hier entfernen und testen, ob's beim Tune (randomizer) Sinn macht.   
        this.tunes = this.tuneBookService.getTunesFiltered();
        console.log('tune-list:ngDoCheck called');
    }
    */

    ngOnDestroy() {
        this.filterActionSubscription.unsubscribe();
        this.modelActionSubscription.unsubscribe();
        //console.log('tune-list:ngOnDestroy called');
    }

    ngAfterViewInit() {
        this.isRendering = false;
        //setTimeout(() => this.cdr.reattach());
        this.tuneBookService.isRendered();
        //console.log('tune-list:ngAfterViewInit called');
    }

    isSelected(tune: Tune) {
        return tune.id === this.selectedId;
    }

}


