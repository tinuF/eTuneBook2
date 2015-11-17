/// <reference path="../../typings.d.ts" />
import {Component, ElementRef} from 'angular2/angular2';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {Playlist} from '../../business/model/playlist';
import {getSystemProperties} from '../../common/system-properties';
import {EliminateThe} from '../../pipes/eliminate-the';


@Component({
  selector: 'etb-play-list-list-item',
  inputs: ['playlist'],
  templateUrl: './components/play-list-list-item/play-list-list-item.html',
  directives: [ROUTER_DIRECTIVES],
  styleUrls: ['./components/play-list-list-item/play-list-list-item.css'],
  pipes: [EliminateThe]
})
export class PlaylistListItemUI {
  playlist: Playlist;
  
  constructor(public tuneBookService: TuneBookService, public router: Router, public elementRef: ElementRef) {
    
  }
  
  onInit() {
    //needs jQuery UI
    //jQuery(this.elementRef.nativeElement).draggable({containment:'#draggable-parent'});
  }
  
  
}


