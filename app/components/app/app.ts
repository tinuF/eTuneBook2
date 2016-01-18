import {Component} from 'angular2/core';
import {Route, RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';

import {getSystemProperties} from '../../common/system-properties';
import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {FilterSettings} from '../../common/settings/filter-settings';

import {BookUI} from '../../components/book/book';
import {AbcUI} from '../../components/abc/abc';
import {TuneListUI} from '../../components/tune-list/tune-list';
import {SetListUI} from '../../components/set-list/set-list';
import {PlaylistListUI} from '../../components/play-list-list/play-list-list';
import {PlaylistUI} from '../../components/play-list/play-list';
import {TuneUI} from '../../components/tune/tune';
import {FilterUI} from '../../components/filter/filter';
import {FilterTextUI} from '../../components/filter-text/filter-text';
import {Introduction} from '../../components/introduction/introduction';
import {BookTitleUI} from '../../components/book-title/book-title';
import {TuneTitleUI} from '../../components/tune-title/tune-title';
import {TuneAbcUI} from '../../components/tune-abc/tune-abc';
import {RandomUI} from '../../components/random/random';


@Component({
  selector: 'etb-app',
  providers: [TuneBookService],
  templateUrl: './components/app/app.html',
  styleUrls: ['./components/app/app.css'],
  directives: [ROUTER_DIRECTIVES, FilterTextUI, BookTitleUI, TuneTitleUI, RandomUI]
})
@RouteConfig([
  { path: '/', redirectTo: ['Introduction'], name: 'Home' },
  { path: '/book', component: BookUI, name: 'Book' },
  { path: '/abc', component: AbcUI, name: 'Abc' },
  { path: '/info/introduction', component: Introduction, name: 'Introduction' },
  { path: '/tunes', component: TuneListUI, name: 'Tunelist' },
  { path: '/tunes/:id', component: TuneUI, name: 'Tune' },
  { path: '/tunes/:id/abc', component: TuneAbcUI, name: 'Tuneabc' },
  { path: '/sets', component: SetListUI, name: 'Setlist' },
  { path: '/filter', component: FilterUI, name: 'Filter' },
  { path: '/playlists', component: PlaylistListUI, name: 'PlaylistList'},
  { path: '/playlists/:id', component: PlaylistUI, name: 'Playlist' }
])
export class App {
  tuneBook: TuneBook;
  systemProperties;
  filterSettings; FilterSettings;
  
  bookMenuActive: boolean;
  playlistsMenuActive: boolean;
  setsMenuActive: boolean;
  tunesMenuActive: boolean;
  infoMenuActive: boolean;
  // Init available colors
  //$.fn.colorPicker.defaults.colors = ['F5F5F5', 'CCFFCC', 'EFEBD6', 'FFFF99', 'C7DAD4', 'BFE4FF', 'D8CFE6', 'FFE6E6', 'EEE6FF', 'E6FFE6', 'FFCCBF', 'FFFFFF', 'CCCCFF', 'FFFFCC', 'FF9980'];

  constructor(public tuneBookService: TuneBookService, public router: Router) {
    this.systemProperties = getSystemProperties();
    this.tuneBook =  this.tuneBookService.getTuneBookFromLocalStorage();
    this.filterSettings = this.tuneBookService.getCurrentFilterSettings();

    if (this.tuneBook != null && this.tuneBook.hasOwnProperty("tuneSets")){

    } else {
      // Init TuneBook
      this.tuneBook = this.tuneBookService.initializeTuneBook();
      router.navigate(['/Introduction']);
    }
  }

  initActiveMenu(){
    this.bookMenuActive = false;
    this.playlistsMenuActive = false;
    this.setsMenuActive = false;
    this.tunesMenuActive = false;
    this.infoMenuActive = false;
  }
  
  loadBxplTuneBook() {
    setTimeout(() => {
      try {
        this.tuneBook = this.tuneBookService.getDefaultFromServer();
      } catch (e) {
        alert("eTuneBook cannot import " + this.systemProperties.EXAMPLE_FILENAME + " due to: " + e.toString());
      } finally {
        this.tuneBookService.storeTuneBookAbc();
        alert("Tunebook successfully loaded");
        this.router.navigate(["/Tunelist"]);
      }
    }, 0);
  }
  
  readTuneBookFromLocalDrive($event) {
    var files = $event.target.files; // FileList object

    // files is a FileList of File objects
    for (var i = 0, f; f = files[i]; i++) {
      var fileName = encodeURI(f.name);			
		
      //Get file extension from fileName
      var ext = fileName.replace(/^.*?\.([a-zA-Z0-9]+)$/, "$1");

      if (ext != "abc" && ext != "ABC") {
        alert("eTuneBook only accepts files with extension .abc or .ABC");

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
  
  getTuneBookFromImportedFile(abc, fileName) {
    setTimeout(() => {
      try {
        this.tuneBook = this.tuneBookService.getTuneBookFromImportedFile(abc, fileName);

      } catch (e) {
        alert("eTuneBook cannot import " + fileName + " due to: " + e.toString());

      } finally {
        this.tuneBookService.storeTuneBookAbc();
        this.router.navigate(["/Tunelist"]);
        
        /*
        if (this.router.) {
          
        }
        
        if ($state.is('tunelist')){
                  $state.transitionTo('setlist');
              } else {
                  $state.transitionTo('tunelist');
              }
              */
      }
    }, 0);
  }
    
  editTuneBook() {
    this.initActiveMenu();
    this.bookMenuActive = true;
    this.router.navigate(['/Book']);
  }
  
  search(event){
    let searchText = event.target.value.trim().toLowerCase();
    this.filterSettings.setTitle(searchText);
    
    this.tuneBookService.applyFilter();
  }
  
  initializeTuneBook() {
    this.tuneBook = this.tuneBookService.initializeTuneBook();
    this.tuneBookService.storeTuneBookAbc();
    this.router.navigate(['Tuneabc', {id: this.tuneBook.tuneSets[0].tuneSetPositions[0].tune.intTuneId}]);
  }
  
  newTune() {
      let newTuneSet = this.tuneBookService.initializeTuneAndTuneSet();
      this.tuneBookService.storeTuneBookAbc();
      this.router.navigate(['Tuneabc', {id: newTuneSet.tuneSetPositions[0].tune.intTuneId}]);
  }
  
  exportTuneBook() {
      this.router.navigate(['/Abc']);
  }
}