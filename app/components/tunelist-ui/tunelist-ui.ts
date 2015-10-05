/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgFor, DoCheck} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TuneListItemUI} from '../../components/tunelist-item-ui/tunelist-item-ui';


@Component({
  selector: 'tunelist'
})
@View({
  templateUrl: './components/tunelist-ui/tunelist-ui.html',
  directives: [NgFor, ROUTER_DIRECTIVES, TuneListItemUI],
  styleUrls: ['./components/tunelist-ui/tunelist-ui.css'],
})
export class TuneListUI implements DoCheck {
  tunes: Array<Tune>;
 
  constructor(public tuneBookService: TuneBookService) {
    this.tunes = this.tuneBookService.getTunesFiltered();
  }
  
  doCheck(){
    //todo: this does not work properly with text-search (might be called to often?)
    //with filter it works fine
    //example: text-search 'derry' among slip-jigs gives Dever the Dancer, Humours of Derrycrossane, Slide from Grace
    //(mixture-search 'de' and 'derry')
    this.tunes = this.tuneBookService.getTunesFiltered();
  }
}


