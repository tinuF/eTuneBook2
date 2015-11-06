/// <reference path="../../typings.d.ts" />
import {Component, NgFor} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {Playlist} from '../../business/model/playlist';
import {SetPlaylistListItemUI} from '../../components/set-playlist-list-item/set-playlist-list-item';


@Component({
  selector: 'etb-set-playlist-list',
  inputs: ['set'],
  templateUrl: './components/set-playlist-list/set-playlist-list.html',
  directives: [NgFor, ROUTER_DIRECTIVES, SetPlaylistListItemUI],
  styleUrls: ['./components/set-playlist-list/set-playlist-list.css']
})
export class SetPlaylistListUI {
  set: TuneSet;
  playlists: Array<Playlist>;
 
  constructor(public tuneBookService: TuneBookService) {
    
  }
  
  onInit(){
    this.playlists = this.tuneBookService.getPlaylistsByTuneSetId(this.set.tuneSetId);
  }
}


