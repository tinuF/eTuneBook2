/// <reference path="../../typings.d.ts" />
import {Component, NgFor, ElementRef} from 'angular2/angular2';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {TuneSetPosition} from '../../business/model/tunesetposition';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {TuneSetPositionPlayInfo} from '../../business/model/tunesetposition-playinfo';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {FilterSettings} from '../../common/settings/filter-settings';
import {SetListItemUI} from '../../components/set-list-item/set-list-item';


@Component({
  selector: 'etb-play-list-item',
  inputs: ['position'],
  templateUrl: './components/play-list-item/play-list-item.html',
  directives: [ROUTER_DIRECTIVES, NgFor, SetListItemUI],
  styleUrls: ['./components/play-list-item/play-list-item.css'],
  pipes: [EliminateThe, FromNow]
})
export class PlayListItemUI {
  position: PlaylistPosition;
  playInfos: Array<TuneSetPositionPlayInfo>
  
  constructor(public tuneBookService: TuneBookService, public router: Router, public elementRef: ElementRef) {
    
  }
  
  onInit() {
   this.playInfos = this.tuneBookService.getTuneSetPositionPlayInfosForPlaylistPosition(this.position);
  }
}


