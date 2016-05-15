import {Component, OnInit} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {Playlist} from '../../business/model/playlist';
import {TuneSet} from '../../business/model/tuneset';
import {FilterSettings} from '../../common/settings/filter-settings';

import {BookUI} from '../../components/book/book';
import {AbcUI} from '../../components/abc/abc';
import {TuneListUI} from '../../components/tune-list/tune-list';
import {SetListUI} from '../../components/set-list/set-list';
import {PlaylistListUI} from '../../components/playlist-list/playlist-list';
import {PlaylistUI} from '../../components/playlist/playlist';
import {PlaylistPositionUI} from '../../components/playlist-position/playlist-position';
import {TuneUI} from '../../components/tune/tune';
import {FilterUI} from '../../components/filter/filter';
import {FilterTextUI} from '../../components/app/filter-text';
import {Home} from '../../components/help/home';
import {ChangeLog} from '../../components/help/changelog';
import {BookTitleUI} from '../../components/app/book-title';
import {TuneAbcUI} from '../../components/tune-abc/tune-abc';
import {SideNavigationUI} from '../../components/app/side-nav';
import {SocialNavigationUI} from '../../components/app/social-nav';


@Component({
    selector: 'etb-app',
    providers: [TuneBookService],
    templateUrl: './components/app/app.html',
    styleUrls: ['./components/app/app.css'],
    directives: [ROUTER_DIRECTIVES, FilterTextUI, BookTitleUI, SideNavigationUI, SocialNavigationUI]
})
@RouteConfig([
    { path: '/', redirectTo: ['Home'], name: 'Home' },
    { path: '/book', component: BookUI, name: 'Book' },
    { path: '/abc', component: AbcUI, name: 'Abc' },
    { path: '/home', component: Home, name: 'Home' },
    { path: '/changelog', component: ChangeLog, name: 'ChangeLog' },
    { path: '/tunes', component: TuneListUI, name: 'Tunelist' },
    { path: '/tunes/:id', component: TuneUI, name: 'Tune' },
    { path: '/tunes/:id/abc', component: TuneAbcUI, name: 'Tuneabc' },
    { path: '/sets', component: SetListUI, name: 'Setlist' },
    { path: '/filter', component: FilterUI, name: 'Filter' },
    { path: '/playlists', component: PlaylistListUI, name: 'PlaylistList' },
    { path: '/playlists/:id', component: PlaylistUI, name: 'Playlist' },
    { path: '/playlists/:id/position/:pos', component: PlaylistPositionUI, name: 'PlaylistPosition' }
])
export class App implements OnInit {
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
            this.router.navigate(['/Home']);
        }
    }
    
    loadBxplTuneBook() { 
        //Hier braucht es offensichtlich kein this.tuneBook = ...
        //vermutlich wegen dem Binding im Template. 
        this.tuneBookService.getExampleTuneBookFromServer();
        this.router.navigate(["/Tunelist"]);
    }

    readTuneBookFromLocalDrive($event) {
        var files = $event.target.files; // FileList object

        // files is a FileList of File objects
        for (var i = 0, f; f = files[i]; i++) {
            var fileName = encodeURI(f.name);
            //Get file extension from fileName
            var ext = fileName.replace(/^.*?\.([a-zA-Z0-9]+)$/, "$1");

            if (ext !== "abc" && ext !== "ABC" && ext !== "txt" && ext !== "TXT") {
                alert("eTuneBook only accepts files with extension .abc or .txt");

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

    getTuneBookFromImportedFile(abc:string, fileName:string) {
        setTimeout(() => {
            try {
                this.tuneBook = this.tuneBookService.getTuneBookFromImportedFile(abc, fileName);
                
            } catch (e) {
                alert("eTuneBook cannot import " + fileName + " due to: " + e.toString());

            } finally {
                this.router.navigate(["/Tunelist"]);
            }
        }, 0);
    }

    editTuneBook() {
        this.router.navigate(['/Book']);
    }

    search(event) {
        let searchText = event.target.value.trim().toLowerCase();
        this.filterSettings.setTitle(searchText);
        this.tuneBookService.applyFilter();
    }

    initializeTuneBook() {
        this.tuneBook = this.tuneBookService.initializeTuneBook();
        this.router.navigate(['/Tuneabc', { id: this.tuneBook.tuneSets[0].tuneSetPositions[0].tune.id }]);
    }

    newTune() {
        let newTuneSet: TuneSet = this.tuneBookService.initializeTuneAndTuneSet();
        this.router.navigate(['/Tuneabc', { id: newTuneSet.tuneSetPositions[0].tune.id }]);
    }

    newPlaylist() {
        let newPlaylist: Playlist = this.tuneBookService.addEmptyPlaylist();
        this.router.navigate(['/Playlist', { id: newPlaylist.id }]);
    }

    exportTuneBook() {
        this.router.navigate(['/Abc']);
    }
}
