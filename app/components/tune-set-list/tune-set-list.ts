/// <reference path="../../typings.d.ts" />
import {Component, NgFor} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TuneSet} from '../../business/model/tuneset';

import {SetListItemUI} from '../../components/set-list-item/set-list-item';


@Component({
  selector: 'tune-set-list',
  inputs: ['tune: tune'],
  templateUrl: './components/tune-set-list/tune-set-list.html',
  styleUrls: ['./components/tune-set-list/tune-set-list.css'],
  directives: [NgFor, ROUTER_DIRECTIVES, SetListItemUI]
})
export class TuneSetListUI {
  tune: Tune;
  sets: Array<TuneSet>;
 
  constructor(public tuneBookService: TuneBookService) {
    
  }
  
  onInit(){
    this.sets = this.tuneBookService.getTuneSetsByIntTuneId(this.tune.intTuneId);
  }
}


