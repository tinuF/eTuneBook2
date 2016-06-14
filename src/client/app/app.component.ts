import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { TuneBookService, TuneBook, Playlist, TuneSet, FilterSettings} from './business/index';
import { FilterTextComponent, SideNavigationComponent, SocialNavigationComponent, BookTitleComponent } from './shared/index';

@Component({
    moduleId: module.id,
    selector: 'etb-app',
    providers: [TuneBookService],
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [ROUTER_DIRECTIVES, FilterTextComponent, BookTitleComponent,
        SideNavigationComponent, SocialNavigationComponent]
})
export class AppComponent implements OnInit {
    tuneBook: TuneBook;
    filterSettings: FilterSettings;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.tuneBook = this.tuneBookService.getCurrentTuneBook();
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();

        if (this.tuneBook === null) {
            // Init TuneBook
            this.tuneBook = this.tuneBookService.initializeTuneBook();
            this.router.navigate(['/welcome']);
        }
    }

    loadBxplTuneBook() {
        //Hier braucht es offensichtlich kein this.tuneBook = ...
        //vermutlich wegen dem Binding im Template. 
        this.tuneBookService.getExampleTuneBookFromServer();
        this.router.navigate(['/tunes']);
    }

    readTuneBookFromLocalDrive($event) {
        var files = $event.target.files; // FileList object

        // files is a FileList of File objects
        for (var i = 0, f; f = files[i]; i++) {
            var fileName = encodeURI(f.name);
            //Get file extension from fileName
            var ext = fileName.replace(/^.*?\.([a-zA-Z0-9]+)$/, '$1');

            if (ext !== 'abc' && ext !== 'ABC' && ext !== 'txt' && ext !== 'TXT') {
                alert('eTuneBook only accepts files with extension .abc or .txt');

            } else {
                // Only process abc files
                var reader = new FileReader();

                reader.onload = () => {
                    var abc = reader.result;
                    this.getTuneBookFromImportedFile(abc, fileName);
                };

                // Read the File
                reader.readAsText(f, 'ISO-8859-1');
            }
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

    search(event) {
        let searchText = event.target.value.trim().toLowerCase();
        this.filterSettings.setTitle(searchText);
        this.tuneBookService.applyFilter();
    }

    initializeTuneBook() {
        this.tuneBook = this.tuneBookService.initializeTuneBook();
        this.router.navigate(['/tunes', this.tuneBook.tuneSets[0].tuneSetPositions[0].tune.id, 'abc' ]);
    }

    newTune() {
        let newTuneSet: TuneSet = this.tuneBookService.initializeTuneAndTuneSet();
        this.router.navigate(['/tunes', newTuneSet.tuneSetPositions[0].tune.id, 'abc' ]);
    }

    newPlaylist() {
        let newPlaylist: Playlist = this.tuneBookService.addEmptyPlaylist();
        this.router.navigate(['/playlist', newPlaylist.id ]);
    }

    exportTuneBook() {
        this.router.navigate(['/abc']);
    }
}
