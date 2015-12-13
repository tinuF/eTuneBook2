/// <reference path="../../typings.d.ts" />
import {Component, NgFor} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {Playlist} from '../../business/model/playlist';
import {SetPlaylistListItemUI} from '../../components/set-play-list-list-item/set-play-list-list-item';


@Component({
  selector: 'etb-set-play-list-list',
  inputs: ['set'],
  templateUrl: './components/set-play-list-list/set-play-list-list.html',
  directives: [NgFor, ROUTER_DIRECTIVES, SetPlaylistListItemUI],
  styleUrls: ['./components/set-play-list-list/set-play-list-list.css']
})
export class SetPlaylistListUI {
  set: TuneSet;
  playlists: Array<Playlist>;
 
  constructor(public tuneBookService: TuneBookService) {
    
  }
  
  onInit(){
    this.playlists = this.tuneBookService.getPlaylistsByTuneSetId(this.set.tuneSetId);
  }
  
  onCheck(){
    this.playlists = this.tuneBookService.getPlaylistsByTuneSetId(this.set.tuneSetId);
  }
}


