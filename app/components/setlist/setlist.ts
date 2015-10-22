/// <reference path="../../typings.d.ts" />
import {Component, View, NgFor, DoCheck} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {SetListItemUI} from '../../components/setlist-item/setlist-item';


@Component({
  selector: 'setlist'
})
@View({
  templateUrl: './components/setlist/setlist.html',
  directives: [NgFor, ROUTER_DIRECTIVES, SetListItemUI],
  styleUrls: ['./components/setlist/setlist.css']
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


