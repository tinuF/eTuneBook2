/// <reference path="../../typings.d.ts" />
import {Component, NgFor, DoCheck} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Playlist} from '../../business/model/playlist';
import {PlaylistListItemUI} from '../../components/play-list-list-item/play-list-list-item';
import {PlaylistListMenuUI} from '../../components/play-list-list-menu/play-list-list-menu';


@Component({
  selector: 'etb-playlist-list',
  templateUrl: './components/play-list-list/play-list-list.html',
  directives: [NgFor, ROUTER_DIRECTIVES, PlaylistListItemUI, PlaylistListMenuUI],
  styleUrls: ['./components/play-list-list/play-list-list.css']
})
export class PlaylistListUI implements DoCheck {
  playlists: Array<Playlist>;
 
  constructor(public tuneBookService: TuneBookService) {
    
  }
  
  onInit(){
    this.playlists = this.tuneBookService.getPlaylistsFiltered();
  }
  
  doCheck(){
    this.playlists = this.tuneBookService.getPlaylistsFiltered();
  }
}


