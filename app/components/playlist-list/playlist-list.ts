/// <reference path="../../typings.d.ts" />
import {Component, View, NgFor, DoCheck} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Playlist} from '../../business/model/playlist';
import {PlaylistListItemUI} from '../../components/playlist-list-item/playlist-list-item';


@Component({
  selector: 'playlist-list'
})
@View({
  templateUrl: './components/playlist-list/playlist-list.html',
  directives: [NgFor, ROUTER_DIRECTIVES, PlaylistListItemUI],
  styleUrls: ['./components/playlist-list/playlist-list.css'],
})
export class PlaylistListUI implements DoCheck {
  playlists: Array<Playlist>;
 
  constructor(public tuneBookService: TuneBookService) {
    this.playlists = this.tuneBookService.getPlaylists();
  }
  
  doCheck(){
    this.playlists = this.tuneBookService.getPlaylists();
  }
}


