/// <reference path="../../typings.d.ts" />
import {Component, View, ElementRef} from 'angular2/angular2';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {Playlist} from '../../business/model/playlist';
import {getSystemProperties} from '../../common/system-properties';
import {EliminateThe} from '../../pipes/eliminate-the';


@Component({
  selector: 'etb-set-playlist-list-item',
  inputs: ['playlist']
})
@View({
  templateUrl: './components/set-playlist-list-item/set-playlist-list-item.html',
  directives: [ROUTER_DIRECTIVES],
  styleUrls: ['./components/set-playlist-list-item/set-playlist-list-item.css'],
  pipes: [EliminateThe]
})
export class SetPlaylistListItemUI {
  playlist: Playlist;
  
  constructor(public tuneBookService: TuneBookService, public router: Router, public elementRef: ElementRef) {
    
  }
  
  onInit() {
    //needs jQuery UI
    //jQuery(this.elementRef.nativeElement).draggable({containment:'#draggable-parent'});
  }
  
  
}


