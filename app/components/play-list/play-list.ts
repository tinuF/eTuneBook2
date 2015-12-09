/// <reference path="../../typings.d.ts" />
import {Component, NgFor} from 'angular2/angular2';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {Playlist} from '../../business/model/playlist';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {PlayListItemUI} from '../../components/play-list-item/play-list-item';
//import {PlayListMenuUI} from './components/play-list-menu/play-list-menu';


@Component({
  selector: 'etb-play-list',
  templateUrl: './components/play-list/play-list.html',
  directives: [NgFor, ROUTER_DIRECTIVES, PlayListItemUI],
  styleUrls: ['./components/play-list/play-list.css']
})
export class PlaylistUI {
  playlist: Playlist;
 
  constructor(public tuneBookService: TuneBookService, routeParams:RouteParams) {
    this.playlist = this.tuneBookService.getPlaylist(routeParams.get('id'));
  }
  
  onInit(){
    this.sortPlaylistPosition();
  }
  
  doCheck(){
    this.sortPlaylistPosition();
  }
  
  sortPlaylistPosition(){
    this.playlist.playlistPositions.sort(function(a:PlaylistPosition, b:PlaylistPosition) {
        return a.position - b.position
    })
  }
}

