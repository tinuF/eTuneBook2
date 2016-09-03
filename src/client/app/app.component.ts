import { Component, OnInit, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, NavigationEnd } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, TuneBook, Playlist, TuneSet, FilterSettings, ACTION} from './business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-app',
    providers: [TuneBookService],
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
})
export class AppComponent implements OnInit {
    tuneBook: TuneBook;
    filterSettings: FilterSettings;
    modusActionSubscription: Subscription;
    isRendering: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router, private cdr: ChangeDetectorRef,
        private appRef: ApplicationRef) {

        // Temporary fix: Back Button does not work on iOS (angular 2.0.0-rc.4, router 3.0.0-beta.2)
        // https://github.com/angular/angular/issues/9565    
        if (this.isMac()) {
            router.events.subscribe(ev => {
                if (ev instanceof NavigationEnd) {
                    setTimeout(() => {
                        appRef.zone.run(() => appRef.tick());
                    }, 500);
                }
            });
        }

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

    randomize() {
        let randomTuneId: number = this.tuneBookService.getRandomTuneId();
        this.router.navigate(['/tunes', randomTuneId]);
    }

    isMac() {
        if (navigator.userAgent.indexOf('Mac') > -1) {
            return true;
        }
        return false;
    }
}
