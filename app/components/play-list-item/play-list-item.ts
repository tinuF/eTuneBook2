import {Component, Input, OnInit} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {TuneSetPosition} from '../../business/model/tunesetposition';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {TuneSetPositionPlayInfo} from '../../business/model/tunesetposition-playinfo';
import {PartPlayInfo} from '../../business/model/partplayinfo';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {FilterSettings} from '../../common/settings/filter-settings';
import {TuneDotsUI} from '../tune-dots/tune-dots';
import {SampleDotsUI} from '../../components/sample-dots/sample-dots';
import {PlaylistTuneUI} from '../../components/play-list-tune/play-list-tune';
import {TunePlayedUI} from '../tune-played/tune-played';
import {SetListItemUI} from '../../components/set-list-item/set-list-item';
import {PartPlayInfoListUI} from '../../components/part-play-info-list/part-play-info-list';
import {PlayListPositionSetPositionUI} from '../../components/play-list-position-set-position/play-list-position-set-position';
import {PlayListPositionSetPositionPlayInfoUI} from '../../components/play-list-position-set-position-play-info/play-list-position-set-position-play-info';




@Component({
  selector: 'etb-play-list-item',
  templateUrl: './components/play-list-item/play-list-item.html',
  directives: [ROUTER_DIRECTIVES, TuneDotsUI, SampleDotsUI, TunePlayedUI, PlaylistTuneUI, SetListItemUI, PartPlayInfoListUI, PlayListPositionSetPositionUI, PlayListPositionSetPositionPlayInfoUI],
  styleUrls: ['./components/play-list-item/play-list-item.css'],
  pipes: [EliminateThe, FromNow]
})
export class PlayListItemUI implements OnInit {
  @Input() playlistPosition: PlaylistPosition;
  
  constructor(public tuneBookService: TuneBookService, public router: Router) {
    
  }
  
  ngOnInit() {
    this.tuneBookService.initializeTuneSetPositionPlayInfosForPlaylist(this.playlistPosition.playlistId);
    this.sortSetPosition();
  }
  
  sortSetPosition(){
    this.playlistPosition.tuneSet.tuneSetPositions.sort(function(a:TuneSetPosition, b:TuneSetPosition) {
        return a.position - b.position
    })
  }
  
  handleKeyDownOnPlaylistPosition(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    
    if (keycode === 13) { // ENTER
      event.target.blur();
      event.preventDefault();
      this.handleBlurOnPlaylistPosition(event);
    }
  }
  
  handleBlurOnPlaylistPosition(event) {
    let oldPosition:number = this.playlistPosition.position
    let newPosition:number = parseInt(event.target.textContent);
    
    if (oldPosition != newPosition) {
      this.tuneBookService.movePlaylistPosition(this.playlistPosition.playlistId, oldPosition, newPosition);
      this.tuneBookService.storeTuneBookAbc();  
    }
  }
}


