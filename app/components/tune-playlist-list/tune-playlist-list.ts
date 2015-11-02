/// <reference path="../../typings.d.ts" />
import {Component, NgFor} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {Playlist} from '../../business/model/playlist';
import {PlaylistListItemUI} from '../../components/playlist-list-item/playlist-list-item';


@Component({
  selector: 'tune-playlist-list',
  inputs: ['tune: tune'],
  templateUrl: './components/tune-playlist-list/tune-playlist-list.html',
  directives: [NgFor, ROUTER_DIRECTIVES, PlaylistListItemUI],
  styleUrls: ['./components/tune-playlist-list/tune-playlist-list.css']
})
export class TunePlaylistListUI {
  tune: Tune;
  playlists: Array<Playlist>;
 
  constructor(public tuneBookService: TuneBookService) {
    
  }
  
  onInit(){
    this.playlists = this.tuneBookService.getPlaylistsByIntTuneId(this.tune.intTuneId);
  }
}


