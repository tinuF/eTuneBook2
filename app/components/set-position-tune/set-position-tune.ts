import {Component, ElementRef, OnInit} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {Tune} from '../../business/model/tune';
import {TuneSetPosition} from '../../business/model/tunesetposition';
import {getSystemProperties} from '../../common/system-properties';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {SampleDotsUI} from '../../components/sample-dots/sample-dots';
import {TunePlayedUI} from '../tune-played/tune-played';

//var dragSrcEl = null;

@Component({
  selector: 'etb-set-position-tune',
  inputs: ['tune', 'position'],
  templateUrl: './components/set-position-tune/set-position-tune.html',
  directives: [ROUTER_DIRECTIVES, SampleDotsUI, TunePlayedUI],
  styleUrls: ['./components/set-position-tune/set-position-tune.css'],
  pipes: [EliminateThe, FromNow]
})
export class SetpositionTuneUI implements OnInit {
  tune: Tune;
  position: TuneSetPosition;
  
  constructor(public tuneBookService: TuneBookService, public router: Router, public elementRef: ElementRef) {
    
  }
  
  ngOnInit() {
    //needs jQuery UI
    //jQuery(this.elementRef.nativeElement).draggable({containment:'#draggable-parent'});
  }
  
  justPlayedTheTune() {
    var now = new Date();
    this.tuneBookService.addTunePlayDate(this.tune, now);
    this.tuneBookService.storeTuneBookAbc();
  }
  
  handleDragStart(e) {
    e.target.style.opacity = '0.4'; // e.target is the source node
    //dragSrcEl = e.target;
    e.dataTransfer.effectAllowed = 'move';
    //e.dataTransfer.setData('text/html', e.target.innerHTML);
    let data:string  = "id:"+this.position.tuneSetId+",pos:"+this.position.position;
    e.dataTransfer.setData('text/html', data);
  }
  
  handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault(); 
    }

    e.dataTransfer.dropEffect = 'move';
    return false;
  }
  
  handleDragEnter(e) {
    e.target.classList.add('over'); 
  }
  
  handleDragLeave(e) {
    e.target.classList.remove('over'); 
  }
  
  handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    
    let data:string = e.dataTransfer.getData('text/html');
    
    let sourceTuneSetId = this.getSourceTuneSetId(data);
    let sourcePosition = this.getSourceTuneSetTunePosition(data);
    let targetTuneSetId = this.position.tuneSetId;
    let targetPosition = this.position.position;
    let moveOrCopy = 'move'
    
    if (e.shiftKey) {
      moveOrCopy = 'copy'
    }
    
    // update model. angular will then react upon the changed model and re-render both sets  
    this.tuneBookService.moveTuneSetPosition(sourceTuneSetId, sourcePosition, targetTuneSetId, targetPosition, 'after', moveOrCopy);
    this.tuneBookService.storeTuneBookAbc();
    
    e.target.style.opacity = '1.0';
      
    return false;
  }
  
  handleDragEnd(e) {
    //TODO: Spezifischer
    let cards = document.querySelectorAll('.card');
  
    [].forEach.call(cards, function (card) {
      card.classList.remove('over');
    });
  }
  
  getSourceTuneSetId(data):number {
    let tuneSetId:string;
    let tuneSetIdSplits:Array<string> = [];
    
    tuneSetIdSplits = data.split("id:");
    
    if (tuneSetIdSplits.length > 1) {
      tuneSetIdSplits = tuneSetIdSplits[1].split(",");
      tuneSetId = tuneSetIdSplits[0].replace(/^\s+|\s+$/g, '');
    }

    return parseInt(tuneSetId);
  }

  getSourceTuneSetTunePosition(data):string {
    let tuneSetTunePosition:string;
    let tuneSetTunePositionSplits:Array<string> = [];
    
    tuneSetTunePositionSplits = data.split("pos:");
    
    if (tuneSetTunePositionSplits.length > 1) {
      tuneSetTunePositionSplits = tuneSetTunePositionSplits[1].split(",");
      tuneSetTunePosition = tuneSetTunePositionSplits[0].replace(/^\s+|\s+$/g, '');
    }
    return tuneSetTunePosition;
  }
  
  deleteTuneSetPosition(e){
    this.tuneBookService.deleteTuneSetPosition(this.position.tuneSetId, this.position.position);
    this.tuneBookService.storeTuneBookAbc();
  }
}