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
import {PartPlayInfoListUI} from '../../components/part-play-info-list/part-play-info-list';



@Component({
  selector: 'etb-play-list-position-set-position-play-info',
  templateUrl: './components/play-list-position-set-position-play-info/play-list-position-set-position-play-info.html',
  directives: [ROUTER_DIRECTIVES, NgFor, NgIf, TuneDotsUI, SampleDotsUI, TunePlayedUI, PlaylistTuneUI, SetListItemUI, PartPlayInfoListUI],
  styleUrls: ['./components/play-list-position-set-position-play-info/play-list-position-set-position-play-info.css'],
  pipes: [EliminateThe, FromNow]
})
export class PlayListPositionSetPositionPlayInfoUI {
  @Input() tuneSetPosition: TuneSetPosition;
  playInfoAnnotationShown: boolean;
  
  constructor(public tuneBookService: TuneBookService, public router: Router) {
    
  }
  
  onInit() {
    this.playInfoAnnotationShown = false;
  }
  
  handleKeyDownOnTuneSetPositionRepeat(event, tuneSetPosition) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    
    if (keycode === 13) { // ENTER
      event.target.blur();
      event.preventDefault();
      this.handleBlurOnTuneSetPositionRepeat(event, tuneSetPosition);
    }
  }
  
  handleBlurOnTuneSetPositionRepeat(event, tuneSetPosition) {
    tuneSetPosition.currentTuneSetPositionPlayInfo.repeat = event.target.textContent;
    this.tuneBookService.storeTuneBookAbc();
  }
  
  handleKeyDownOnTuneSetPositionAnnotation(event, tuneSetPosition) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    
    if (keycode === 13) { // ENTER
      event.target.blur();
      event.preventDefault();
      this.handleBlurOnTuneSetPositionAnnotation(event, tuneSetPosition);
    }
  }
  
  handleBlurOnTuneSetPositionAnnotation(event, tuneSetPosition) {
    tuneSetPosition.currentTuneSetPositionPlayInfo.annotation = event.target.textContent;
    this.tuneBookService.storeTuneBookAbc();
  }
  
  togglePlayInfoAnnotation(){
    this.playInfoAnnotationShown = !this.playInfoAnnotationShown;
    
  }
}


