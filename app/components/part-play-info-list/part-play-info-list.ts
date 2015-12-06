/// <reference path="../../typings.d.ts" />
import {Component, NgFor, NgIf, Input} from 'angular2/angular2';
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



@Component({
  selector: 'etb-part-play-info-list',
  templateUrl: './components/part-play-info-list/part-play-info-list.html',
  directives: [ROUTER_DIRECTIVES, NgFor, NgIf, TuneDotsUI, SampleDotsUI, TunePlayedUI, PlaylistTuneUI, SetListItemUI],
  styleUrls: ['./components/part-play-info-list/part-play-info-list.css'],
  pipes: [EliminateThe, FromNow]
})
export class PartPlayInfoListUI {
  @Input() tuneSetPosition: TuneSetPosition;
  
  constructor(public tuneBookService: TuneBookService, public router: Router) {
    
  }
  
  onInit() {
    
  }
  
  handleKeyDownOnPart(event, partPlayInfo) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    
    if (keycode === 13) { // ENTER
      event.target.blur();
      event.preventDefault();
      this.handleBlurOnPart(event, partPlayInfo);
    }
  }
  
  handleBlurOnPart(event, partPlayInfo) {
    partPlayInfo.part = event.target.textContent;
    this.tuneBookService.storeTuneBookAbc();
  }
  
  handleKeyDownOnPartPlayInfo(event, partPlayInfo) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    
    if (keycode === 13) { // ENTER
      event.target.blur();
      event.preventDefault();
      this.handleBlurOnPartPlayInfo(event, partPlayInfo);
    }
  }
  
  handleBlurOnPartPlayInfo(event, partPlayInfo) {
    partPlayInfo.playInfo = event.target.textContent;
    this.tuneBookService.storeTuneBookAbc();
  }
  
  deletePartPlayInfo(event, tuneSetPositionPlayInfo, partPlayInfo) {
    tuneSetPositionPlayInfo.deletePartPlayInfo(partPlayInfo);
    this.tuneBookService.storeTuneBookAbc();
  }
}


