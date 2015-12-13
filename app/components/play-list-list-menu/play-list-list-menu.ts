/// <reference path="../../typings.d.ts" />
import {Component, NgFor, FORM_DIRECTIVES} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TuneSet} from '../../business/model/tuneset';
import {Playlist} from '../../business/model/playlist';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {FilterSettings} from '../../common/settings/filter-settings';



@Component({
  selector: 'etb-play-list-list-menu',
  inputs: ['playlists'],
  templateUrl: './components/play-list-list-menu/play-list-list-menu.html',
  directives: [ROUTER_DIRECTIVES, NgFor, FORM_DIRECTIVES],
  styleUrls: ['./components/play-list-list-menu/play-list-list-menu.css'],
})
export class PlaylistListMenuUI {
  sorting: string;
  filterSettings: FilterSettings;
  playlists: Array<Playlist>;
  selectedPlaylistId: number;
 
  constructor(public tuneBookService: TuneBookService) {
   
  }
  
  onInit(){
    this.filterSettings = this.tuneBookService.getCurrentFilterSettings(); 
  }
  
  filterPlaylists(e){
    this.filterSettings.togglePlaylistIdFilter();
    this.tuneBookService.applyFilter();  
  }
}


