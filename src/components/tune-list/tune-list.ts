import {Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef} from 'angular2/core';
import {ROUTER_DIRECTIVES, CanReuse, OnReuse, ComponentInstruction} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {Tune} from '../../business/model/tune';
import {TuneListItemUI} from '../../components/tune-list/tune-list-item';
import {TuneListMenuUI} from '../../components/tune-list/tune-list-menu';
import {SpinnerUI} from '../../components/common/spinner';


@Component({
    selector: 'etb-tune-list',
    templateUrl: './components/tune-list/tune-list.html',
    directives: [ROUTER_DIRECTIVES, TuneListItemUI, TuneListMenuUI, SpinnerUI],
    styleUrls: ['./components/tune-list/tune-list.css'],
})
export class TuneListUI implements OnInit, OnDestroy, AfterViewInit, CanReuse, OnReuse {
    tunes: Array<Tune>;
    isRendering:boolean;
    filterActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, private cdr : ChangeDetectorRef) {
        //console.log("tune-list:constructor called");
    }

    ngOnInit() {
        // we need to detach the change detector initially, to prevent a
        // "changed after checked" error.
        
        //TODO: Spinner-Logik läuft auf eine Exception
        //Aktueller Zone-Bug: https://github.com/angular/angular/issues/7721
        
        //this.cdr.detach();
        //this.isRendering = true;
        this.tunes = this.tuneBookService.getTunesFiltered();
        
        this.filterActionSubscription = this.tuneBookService.filterActionObservable.subscribe(
            (action) => {
                console.log("tune-list:filterActionSubscription called: " + action);
                if (action === ACTION.APPLY_FILTER) {
                    this.tunes = this.tuneBookService.getTunesFiltered();
                }
            });
        console.log("tune-list:ngOnInit called");
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
        console.log("tune-list:ngDoCheck called");
    }
    */
    
    ngOnDestroy() {
        this.filterActionSubscription.unsubscribe();
        console.log("tune-list:ngOnDestroy called");
    }
    
    ngAfterViewInit() {
        //this.isRendering = false;
        //setTimeout(() => this.cdr.reattach());
        console.log("tune-list:ngAfterViewInit called");
    }
    
    
    routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) {
         return true; 
    }
    
    
    routerOnReuse(next: ComponentInstruction, prev: ComponentInstruction) {
        this.tunes = this.tuneBookService.getTunesFiltered();
        console.log("tune-list:routerOnReuse called");
    }
    
}


