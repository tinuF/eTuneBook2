import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, TuneBook, Playlist, TuneSet, FilterSettings, ACTION} from './business/index';
import { FilterTextComponent, SideNavigationComponent, SocialNavigationComponent,
    BookTitleComponent, SpinnerComponent } from './shared/index';

@Component({
    moduleId: module.id,
    selector: 'etb-app',
    providers: [TuneBookService],
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [ROUTER_DIRECTIVES, FilterTextComponent, BookTitleComponent,
        SideNavigationComponent, SocialNavigationComponent, SpinnerComponent]
})
export class AppComponent implements OnInit {
    tuneBook: TuneBook;
    filterSettings: FilterSettings;
    modusActionSubscription: Subscription;
    isRendering: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router, private cdr: ChangeDetectorRef) {

    }

    ngOnInit() {
        // TuneBook laden. Das TuneBook ist immer vorhanden.
        // -Zuletzt gespeichertes TuneBook aus localstorage
        // -Wenn localstorage leer, dann wird ein neues TuneBook gemacht und in localstorage gespeichert
        this.tuneBook = this.tuneBookService.getCurrentTuneBook();
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();

        // this.isRendering macht nichts auf Ebene app
        // wenn diese Stelle jedoch entfernt wird, dann funktioniert der spinner nicht mehr.
        // warum ist unklar
        this.isRendering = true;
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                //console.log('app:modusActionSubscription called: ' + action);

                if (action === ACTION.IS_RENDERING) {

                    this.isRendering = true;
                    this.cdr.detach();
                } else if (action === ACTION.IS_RENDERED) {
                    this.isRendering = false;
                    setTimeout(() => this.cdr.reattach());
                }
            });
    }

    loadBxplTuneBook() {
        //Hier braucht es offensichtlich kein this.tuneBook = ...
        //vermutlich wegen dem Binding im Template. 
        this.tuneBookService.getExampleTuneBookFromServer();
        this.router.navigate(['/tunes']);
    }

    readTuneBookFromLocalDrive(event: Event) {
        let files: FileList = <FileList>(<any>event.target).files; // FileList object

        // files is a FileList of File objects
        for (let i = 0, f: File; f = files[i]; i++) {
            let fileName = encodeURI(f.name);
            let reader = new FileReader();

            reader.onload = () => {
                let abc = reader.result;
                this.getTuneBookFromImportedFile(abc, fileName);
            };

            // Read the File
            reader.readAsText(f, 'ISO-8859-1');
        }
    }

    getTuneBookFromImportedFile(abc: string, fileName: string) {
        setTimeout(() => {
            try {
                this.tuneBook = this.tuneBookService.getTuneBookFromImportedFile(abc, fileName);

            } catch (e) {
                alert('eTuneBook cannot import ' + fileName + ' due to: ' + e.toString());

            } finally {
                this.router.navigate(['/tunes']);
            }
        }, 0);
    }

    editTuneBook() {
        this.router.navigate(['/book']);
    }

    search(keyboardEvent: KeyboardEvent) {
        let searchText = (<HTMLInputElement>(<Event>keyboardEvent).target).value.trim().toLowerCase();
        this.filterSettings.setTitle(searchText);
        this.tuneBookService.applyFilter();
    }

    initializeTuneBook() {
        this.tuneBook = this.tuneBookService.initializeTuneBookAndBroadcast();
        this.router.navigate(['/tunes', this.tuneBook.tuneSets[0].tuneSetPositions[0].tune.id, 'abc']);
    }

    newTune() {
        let newTuneSet: TuneSet = this.tuneBookService.initializeTuneAndTuneSet();
        this.router.navigate(['/tunes', newTuneSet.tuneSetPositions[0].tune.id, 'abc']);
    }

    newPlaylist() {
        let newPlaylist: Playlist = this.tuneBookService.addEmptyPlaylist();
        this.router.navigate(['/playlist', newPlaylist.id]);
    }

    exportTuneBook() {
        this.router.navigate(['/abc']);
    }
}
