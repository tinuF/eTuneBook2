import { Component, OnInit } from '@angular/core';
import { Routes, Router, ROUTER_DIRECTIVES } from '@angular/router';

import { TuneBookService, TuneBook, Playlist, TuneSet, FilterSettings} from './business/index';
import { FilterTextComponent, SideNavigationComponent, SocialNavigationComponent, BookTitleComponent } from './shared/index';
import { BookComponent } from './+book/book.component';
import { AbcComponent } from './+abc/abc.component';
import { TuneListComponent } from './+tune-list/tune-list.component';
import { SetListComponent } from './+set-list/set-list.component';
import { PlaylistListComponent } from './+playlist-list/playlist-list.component';
import { PlaylistComponent } from './+playlist/playlist.component';
import { PlaylistPositionComponent } from './+playlist-position/playlist-position.component';
import { TuneComponent } from './+tune/tune.component';
import { FilterComponent} from './+filter/filter.component';
import { HomeComponent, ChangeLogComponent } from './+help/index';
import { TuneAbcComponent } from './+tune-abc/tune-abc.component';

@Component({
    moduleId: module.id,
    selector: 'etb-app',
    providers: [TuneBookService],  //angular2 rc.1 broken. TuneBookService not passed to routes.
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [ROUTER_DIRECTIVES, FilterTextComponent, BookTitleComponent,
        SideNavigationComponent, SocialNavigationComponent]
})
/*
@Routes([
    { path: '/', component: HomeComponent, name: 'Home' },
    { path: '/book', component: BookComponent, name: 'Book' },
    { path: '/abc', component: AbcComponent, name: 'Abc' },
    { path: '/home', component: HomeComponent, name: 'Home' },
    { path: '/changelog', component: ChangeLogComponent, name: 'ChangeLog' },
    { path: '/tunes', component: TuneListComponent, name: 'Tunelist' },
    { path: '/tunes/:id', component: TuneComponent, name: 'Tune' },
    { path: '/tunes/:id/abc', component: TuneAbcComponent, name: 'Tuneabc' },
    { path: '/sets', component: SetListComponent, name: 'Setlist' },
    { path: '/filter', component: FilterComponent, name: 'Filter' },
    { path: '/playlists', component: PlaylistListComponent, name: 'PlaylistList' },
    { path: '/playlists/:id', component: PlaylistComponent, name: 'Playlist' },
    { path: '/playlists/:id/position/:pos', component: PlaylistPositionComponent, name: 'PlaylistPosition' }
])
*/


//angular2 rc.1 new router does not swallow:
//{ path: '/tunes', component: TuneListComponent },
//{ path: '/tunes/:id', component: TuneComponent }
//routes have to be unique, or nested

//https://www.youtube.com/watch?v=d8yAdeshpcw&feature=youtu.be
//Components as strings not as types. not in rc.1 

@Routes([
    { path: '/', component: HomeComponent },
    { path: '/book', component: BookComponent },
    { path: '/abc', component: AbcComponent },
    { path: '/home', component: HomeComponent },
    { path: '/changelog', component: ChangeLogComponent },
    { path: '/tunes', component: TuneListComponent },
    { path: '/tune/:id', component: TuneComponent },
    { path: '/tune-abc/:id', component: TuneAbcComponent },
    { path: '/sets', component: SetListComponent },
    { path: '/filter', component: FilterComponent },
    { path: '/playlists', component: PlaylistListComponent },
    { path: '/playlist/:id', component: PlaylistComponent }
    //{ path: '/playlist/:id/position/:pos', component: PlaylistPositionComponent }
])
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
            this.router.navigate(['/home']);
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
        this.router.navigate(['/tune-abc/:id', this.tuneBook.tuneSets[0].tuneSetPositions[0].tune.id ]);
    }

    newTune() {
        let newTuneSet: TuneSet = this.tuneBookService.initializeTuneAndTuneSet();
        this.router.navigate(['/tune-abc/:id', newTuneSet.tuneSetPositions[0].tune.id ]);
    }

    newPlaylist() {
        let newPlaylist: Playlist = this.tuneBookService.addEmptyPlaylist();
        this.router.navigate(['/playlist', newPlaylist.id ]);
    }

    exportTuneBook() {
        this.router.navigate(['/abc']);
    }
}
