/// <reference path="../../typings.d.ts" />
import {Component, NgFor, DoCheck} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {SetListItemUI} from '../../components/set-list-item/set-list-item';
import {SetListMenuUI} from '../../components/set-list-menu/set-list-menu';


@Component({
  selector: 'etb-set-list',
  templateUrl: './components/set-list/set-list.html',
  directives: [NgFor, ROUTER_DIRECTIVES, SetListItemUI, SetListMenuUI],
  styleUrls: ['./components/set-list/set-list.css']
})
export class SetListUI implements DoCheck {
  sets: Array<TuneSet>;
 
  constructor(public tuneBookService: TuneBookService) {
    this.sets = this.tuneBookService.getTuneSetsFiltered();
  }
  
  doCheck(){
    this.sets = this.tuneBookService.getTuneSetsFiltered();
  }
}


