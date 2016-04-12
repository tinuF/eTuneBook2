import {Component, OnInit, DoCheck, OnDestroy, AfterViewInit, ChangeDetectorRef} from 'angular2/core';
import {ROUTER_DIRECTIVES, CanReuse, OnReuse, ComponentInstruction} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TuneListItemUI} from '../../components/tunes/tune-list-item';
import {TuneListMenuUI} from '../../components/tunes/tune-list-menu';
import {SpinnerUI} from '../../components/common/spinner';


@Component({
    selector: 'etb-tune-list',
    templateUrl: './components/tunes/tune-list.html',
    directives: [ROUTER_DIRECTIVES, TuneListItemUI, TuneListMenuUI, SpinnerUI],
    styleUrls: ['./components/tunes/tune-list.css'],
})
export class TuneListUI implements OnInit, DoCheck, OnDestroy, AfterViewInit, CanReuse, OnReuse {
    tunes: Array<Tune>;
    isRendering:boolean;

    constructor(public tuneBookService: TuneBookService, private cdr : ChangeDetectorRef) {
        this.tunes = this.tuneBookService.getTunesFiltered();
        console.log("tune-list:constructor called");
    }

    ngOnInit() {
        // we need to detach the change detector initially, to prevent a
        // "changed after checked" error.
        
        //TODO: Spinner-Logik läuft auf eine Exception
        //Aktueller Zone-Bug: https://github.com/angular/angular/issues/7721
        
        //this.cdr.detach();
        //this.isRendering = true;
        console.log("tune-list:ngOnInit called");
    }
    
    ngDoCheck() {
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
    
    ngOnDestroy() {
        console.log("tune-list:ngOnDestroy called");
    }
    
    ngAfterViewInit() {
        //this.isRendering = false;
        //setTimeout(() => this.cdr.reattach());
        console.log("tune-list:ngAfterViewInit called");
    }
    
    //does not work
    routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) {
         return true; 
    }
    
    //does not work. Komponente wird zerstört bei Weg-Nagivation.
    routerOnReuse(next: ComponentInstruction, prev: ComponentInstruction) {
        this.tunes = this.tuneBookService.getTunesFiltered();
        console.log("tune-list:routerOnReuse called");
    }
}


