/// <reference path="./typings/_custom.d.ts" />
import {Component, View, bootstrap} from 'angular2/angular2';
import {Route, RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_BINDINGS} from 'angular2/router';

import {Home} from './components/home/home';

import {getSystemProperties} from './common/system-properties';
import {TuneBookService} from './services/tunebook-service';
import {TuneBook} from './business/model/tunebook';
import {FilterSettings} from './common/settings/filter-settings';

import {BookUI} from './components/book-ui/book-ui';
import {TuneListUI} from './components/tunelist-ui/tunelist-ui';
import {TuneUI} from './components/tune-ui/tune-ui';
import {FilterUI} from './components/filter-ui/filter-ui';
import {FilterTextUI} from './components/filter-text-ui/filter-text-ui';
import {Introduction} from './components/introduction/introduction';
import {BookTitleUI} from './components/book-title-ui/book-title-ui';
import {TuneTitleUI} from './components/tune-title-ui/tune-title-ui';
import {TuneAbcUI} from './components/tune-abc-ui/tune-abc-ui';
import {RandomTuneUI} from './components/random-tune-ui/random-tune-ui';
import {PageTitleUI} from './components/page-title-ui/page-title-ui';


@Component({
  selector: 'app',
  bindings: [TuneBookService]
})
@RouteConfig([
  { path: '/', component: Home, as: 'home' },
  { path: '/book', component: BookUI, as: 'book' },
  { path: '/info/introduction', component: Introduction, as: 'introduction' },
  { path: '/tunes', component: TuneListUI, as: 'tunelist' },
  //TuneUI: Component with Child-Router. /... means partial Route
  { path: '/tunes/:id/...', component: TuneUI, as: 'tune' },
  { path: '/tunes/:id/abc', component: TuneAbcUI, as: 'tuneabc' },
  { path: '/filter', component: FilterUI, as: 'filter' }
  //{ path: '/playlists', component: PlaylistList, as: 'playlistlist' },
  //{ path: '/setlist', component: Setlist, as: 'setlist' },
])
@View({
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  directives: [ROUTER_DIRECTIVES, FilterTextUI, BookTitleUI, TuneTitleUI, PageTitleUI, RandomTuneUI]
})
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
      router.navigate('/introduction');
    }
    
    // Needed for material-light (Dropdowns, Search-Button...)
    // http://stackoverflow.com/questions/31278781/material-design-lite-integration-with-angularjs
    // TODO: Typescript für componentHandler
    setTimeout(() => {
      componentHandler.upgradeAllRegistered();
    }, 0);
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
        this.router.navigate("/tunes");
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
        this.router.navigate("/tunes");
        
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
    this.router.navigate('/book');
  };
  
  showTunes(  ) {
    this.initActiveMenu();
    this.tunesMenuActive = true;
    this.router.navigate("/tunes");
  };
  
  showFilter() {
    this.router.navigate('/filter');
  };
  
  search(event){
    let searchText = event.target.value.trim().toLowerCase();
    this.filterSettings.setTitle(searchText);
    
    this.tuneBookService.applyFilter();
  }
  
  
  doSomeThing(event) {
    //does not work yet (events do not bubble over router-outlet)
    alert('Filter has changed');
    //this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
  };
  

/*
  mobilecheck() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };
  */

/*
  
*/

/*

  initializeTuneBook( ) {
    this.tuneBook = this.eTuneBookService.initializeTuneBook();
    this.eTuneBookService.storeTuneBookAbc();
    this.router.navigate('tuneabc', {intTuneId: this.tuneBook.tuneSets[0].tuneSetPositions[0].tune.intTuneId});
  };

  

  showPlaylists(  ) {
    this.initActiveMenu();
    this.playlistsMenuActive = true;
    $state.transitionTo('playlistlist');
  };

  showSets(  ) {
    this.initActiveMenu();
    this.setsMenuActive = true;
    $state.transitionTo('setlist');
  };

  

  


  putTuneBookToLocalStorage() {
    this.eTuneBookService.storeTuneBookAbc();
  };



  // Import TuneBook from Google Drive
  selectFileOnGoogleDrive() {

      // User needs to login and to authorize eTuneBook so that eTuneBook is able to access his Google Drive
      var promise = GAPI.init();

      promise.then(function(result) {
          //success
          //Load Google Drive File Picker
          loadPicker();
      }, function(error) {
          //error
          alert('Failed: ' + error);
      });
  };

  // Use the API Loader script to load google.picker.
  loadPicker() {
      gapi.load('picker', {'callback': createPicker});
  }

  // Create and render a Picker object for searching documents
  createPicker() {
      var docsView = new google.picker.DocsView(google.picker.ViewId.DOCUMENTS)
          .setIncludeFolders(true);

      var picker = new google.picker.PickerBuilder().
          addView(docsView).
          setAppId(GAPI.app.apiKey).
          setOAuthToken(GAPI.app.oauthToken.access_token).
          setCallback(pickerCallback).
          build();
      picker.setVisible(true);
  }

  // Back from the Picker
  pickerCallback(data) {
      var url = 'nothing';
      if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
          var doc = data[google.picker.Response.DOCUMENTS][0];
          url = doc[google.picker.Document.URL];

          //Metadaten des ausgewählten Dokuments holen
          var promise = Drive.getFiles(doc[google.picker.Document.ID]);

          promise.then(function(file) {
              //success
              //File-Download und Übernahme in eTuneBook
              importTuneBookFromGoogleDrive(file);

          }, function(error) {
              //error
              alert('Failed: ' + error);
          });
      }
  }

  importTuneBookFromGoogleDrive(file) {

      if (file.downloadUrl) {
          var accessToken = GAPI.app.oauthToken.access_token;
          var xhr = new XMLHttpRequest();
          xhr.open('GET', file.downloadUrl);
          xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
          xhr.onload = function() {
              eTuneBookService.getTuneBookFromImportedFile(xhr.responseText, file.title);
              eTuneBookService.storeTuneBookAbc();
              // TODO: Check for ui-router fix
              // ui-router does not refresh state, if no parameter has changed
              //(see https://github.com/angular-ui/ui-router/issues/122)
              // Umgehungsloesung: Alternativ tunelist oder setlist als Start-Page
              if ($state.is('tunelist')){
                  $state.transitionTo('setlist');
              } else {
                  $state.transitionTo('tunelist');
              }
          };
          xhr.onerror = function() {
              alert("Fehler beim Download des TuneBooks");
              //callback(null);
          };
          xhr.send();
      } else {
          alert("Fehler beim Laden des TuneBooks (kein Download-Link)");
          //callback(null);
      }
  };





  exportTuneBook(startDownload) {
      $state.transitionTo('abc');
  };

  */

/*
  this.$watch(function () { return $location.path(); }, function() {
      var path = $location.path();
      var pathSplits = path.split("/");
      var beginOfPath = pathSplits[1].substring(0,4);

      //this.pathSplits = pathSplits;

      initActiveMenu();
      if (beginOfPath == "sets"){
          if (pathSplits.length == 2){
              this.setsMenuActive = true;
          }
      } else if (beginOfPath == "tune"){
          if (pathSplits.length == 2){
              this.tunesMenuActive = true;
          }
      } else if (beginOfPath == "book"){
          this.bookMenuActive = true;
      } else if (beginOfPath == "play"){
          if (pathSplits.length == 2){
              this.playlistsMenuActive = true;
          }
      } else if (beginOfPath == "abc"){
          this.bookMenuActive = true;
      } else if (beginOfPath == "info"){
          this.infoMenuActive = true;
      }
  });

  $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
      $rootScope.$previousState = from;
      $rootScope.$previousStateParams = fromParams;
  });
  */
}


bootstrap(App, [ROUTER_BINDINGS]);
