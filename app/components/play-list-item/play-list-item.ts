/// <reference path="../../typings.d.ts" />
import {Component, NgFor, Input} from 'angular2/angular2';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {TuneSetPosition} from '../../business/model/tunesetposition';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {TuneSetPositionPlayInfo} from '../../business/model/tunesetposition-playinfo';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {FilterSettings} from '../../common/settings/filter-settings';
import {TuneDotsUI} from '../tune-dots/tune-dots';
import {SampleDotsUI} from '../../components/sample-dots/sample-dots';
import {PlaylistTuneUI} from '../../components/play-list-tune/play-list-tune';
import {TunePlayedUI} from '../tune-played/tune-played';



@Component({
  selector: 'etb-play-list-item',
  templateUrl: './components/play-list-item/play-list-item.html',
  directives: [ROUTER_DIRECTIVES, NgFor, TuneDotsUI, SampleDotsUI, TunePlayedUI, PlaylistTuneUI],
  styleUrls: ['./components/play-list-item/play-list-item.css'],
  pipes: [EliminateThe, FromNow]
})
export class PlayListItemUI {
  @Input() playlistPosition: PlaylistPosition;
  
  constructor(public tuneBookService: TuneBookService, public router: Router) {
    
  }
  
  onInit() {
    this.tuneBookService.initializeTuneSetPositionPlayInfosForPlaylist(this.playlistPosition.playlistId);
    this.sortSetPosition();
  }
  
  sortSetPosition(){
    this.playlistPosition.tuneSet.tuneSetPositions.sort(function(a:TuneSetPosition, b:TuneSetPosition) {
        return a.position - b.position
    })
  }
  
  prepareForEdit(event){
    //check http://plnkr.co/edit/Yt4bFd9mF9iwZirtWvYg?p=preview
    event.target.setAttribute('contentEditable', 'true'); 
    event.target.focus();
  }
  
  handleKeyDownOnTuneSetPositionRepeat(event, tuneSetPosition) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    // on "enter" set "contentEditable" to "false" to make field not-editable again
    // and call "read" method which is responsible for setting new value to the object in ngModel
    if (keycode === 13) { // ENTER
      event.target.setAttribute('contentEditable', 'false');
      event.target.blur();
      event.preventDefault();
      tuneSetPosition.currentTuneSetPositionPlayInfo.repeat = event.target.textContent;
      this.tuneBookService.storeTuneBookAbc();
    }
    // on "escape"and set the text in the element back to the original value
    // and set "contentEditable" to "false" to make field not-editable again
    /*
    if (keycode === 27) { // ESCAPE
      element.text(ngModel.$viewValue);
      event.target.setAttribute('contentEditable', 'false');
      event.target.blur();
    }
    */
  }
}


